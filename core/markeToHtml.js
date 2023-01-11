const { marked } = require('marked');


const renderer = {
    code(code, infostring,escaped) {
      return `<pre class="prettyprint linenums">${code}</pre>`;
    },
    table(header,body){
        return `<table class="hui-table hui-table-border hui-table-bordered hui-table-hover">
                ${header}
                ${body}
            </table>`
    },
    list(body,ordered,start){
        body=body.replaceAll('<li>','<li class="hui-list-item">');
        if(ordered){
            return `<ol class="hui-list hui-list-decimal" start="${start}" style="padding-inline-start: 40px;">${body}</ol>`
        }else{
            return `<ul class="hui-list hui-list-disc" style="padding-inline-start: 40px;">${body}</ul>`
        }
    },
    link(href,title,text){
        return `<a href="${href}" target="_blank" style="color: #0366d6;">${text}</a>`
    }
  };

marked.use({ renderer });


module.exports = marked;