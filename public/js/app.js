var js_code = function(){
    let jsdom = require('jsdom').JSDOM,
     
    // the file I will be loading
    uri = 'views/user/show.ejs',
     
    // the options that I will be giving to jsdom
    options = {
        runScripts: 'dangerously',
        resources: "usable"
    };
    
    // load from an external file
    jsdom.fromFile(uri, options).then(function (dom) {
     
        let document = dom.window.document
        let show_more_button = document.getElementById("show_more")
        
        show_more_button.addEventListener('click', function(){
            document.querySelector("#info_user").classList.toggle("show");
        })
        
        const event = document.createEvent('CustomEvent')
        event.initEvent('click',true, true)
        console.log(event)
        show_more_button.dispatchEvent(event)
     
    }).catch (function (e) {
        console.log(e);
    });
    
}

//module.exports = js_code()