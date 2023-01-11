const gulp = require('gulp');
const del = require('del');
const path = require('path')
const chalk = require('chalk');
const Qiniu = require('./core/qiniuUpload');
const Config = require("./config/index");

let $ = require('gulp-load-plugins')({
    pattern: ['gulp-*'],
    replaceString: /\bgulp[\-.]/,
    lazy: true,
    camelize: true
})
let argv = process.argv;
let env = argv[2] == 'production' ? argv[2] :'develop';

//打印函数
function logHandler(type,info){
    switch(type){
        case 'log':
            console.log(chalk.blue(info))
            break;
    }
}



//删除文件操作
function delFileHandler(cb,filePath){
    return del([filePath],cb);
}

//删除  bin
function delBinFile(cb){
    return delFileHandler(cb,'./bin')
}

//处理less文件 放到bin/public/css 目录下
function lessHandler(cd,path = './public/style/**/*.{less,css}') {
    return gulp.src(path)
        .pipe($.less()) //转换less到css
        .pipe($.minifyCss()) //压缩
        .pipe(gulp.dest('./bin/public/css'));
}

//处理js文件  放到bin/public/js 目录下
function jsHandler(cd,path = './public/js/**/*.js') {
    return gulp.src(path)
      .pipe($.if(env == 'production',$.uglify()))//压缩
      .pipe(gulp.dest('./bin/public/js'))
}

//处理pug文件
function pugHandler(cd,path = './views/**'){
    return gulp.src(path)
    .pipe($.replace("CDN_BASE_URL",env == 'production'?Config['production'].qiniuBaseUrl:''))
    .pipe(gulp.dest('./bin/views'))
}
//


// image——放到bin/public/images 目录下
function imageHandler(cd,path = './public/images/**/*.{png,jpg,jpeg,svg,gif}'){
    return gulp.src(path)
    .pipe(gulp.dest('./bin/public/images'))
}
//hui框架文件 放到bin/public/hui 目录下
function huiHandler(cd,path = './public/hui/**'){
    return gulp.src(path)
    .pipe(gulp.dest('./bin/public/hui'))
}

//监控文件变化
function watchFile(cb) {
    const watcher = gulp.watch(['public','views']);
    watcher.on('change', function (path, stats) {
        logHandler('log',`File ${path} was changed`);
        watchFileHandler('change',path)
    });

    watcher.on('add', function (path, stats) {
        logHandler('log',`File ${path} was added`);
        watchFileHandler('add',path)
    });

    watcher.on('unlink', function (path, stats) {
        logHandler('log',`File ${path} was removed`);
        let filePath = path.replace('style/','css/').replace('.less','.css')
        del([filePath]);
    });
    cb();
}

//文件变化后的处理任务
function watchFileHandler(type,filePath){
    const _extname = path.extname(filePath)
    switch(_extname){
        case '.less':
            lessHandler(filePath)
            break;
        case '.js':
            jsHandler(filePath)
            break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
        case '.svg':
            imageHandler(filePath)
            break;
        case '.pug':
            pugHandler(filePath)
            break;
        default:
            huiHandler(filePath)
            break;
    }

}

//默认任务 dev
gulp.task('default', gulp.series(
    delBinFile,
     gulp.parallel(
        lessHandler,
        jsHandler,
        imageHandler,
        huiHandler,
        pugHandler
     ),
     watchFile
))

gulp.task('production', gulp.series(
    delBinFile,
     gulp.parallel(
        lessHandler,
        jsHandler,
        imageHandler,
        huiHandler,
        pugHandler
     )
))

gulp.task('upload', function (cb) {
    var qiniu = new Qiniu(Config['production'].qiniuOptions)
    return gulp.src('./bin/public/**')
    .pipe(qiniu.upload())
})