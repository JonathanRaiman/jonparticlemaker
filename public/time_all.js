/*
┌───────────────────────────────────────────────────────────┐
│                 VERSION WITHOUT TIMEBAR                   │
├───────────────────────────────────────────────────────────┤
│         LOCAL STORAGE EXAMPLES & TRIALS                   │
└───────────────────────────────────────────────────────────┘ 


/*
┌───────────────────────────────────────────────────────────┐
│         SAMPLE DATABASE, SETTINGS, & CONSTRUCTORS         │
└───────────────────────────────────────────────────────────┘ 
*/

function tag(word,strength,date,boss) {
    this.word       = word || "???";
    this.strength   = strength || 0;
    this.boss       = boss || new tag("Knowledge", null, null, this);
    this.to         = new Date();
    this.from       = new Date(0);
    this.connections = [];
    
  if (date != null && date.split("|")[0] != null){
        this.from     = new Date(date.split("|")[0].split("/")[2],(date.split("|")[0].split("/")[1]-1),date.split("|")[0].split("/")[0]);
  }
  if (date != null && date.split("|")[1] != null){
        this.to       = new Date(date.split("|")[1].split("/")[2],(date.split("|")[1].split("/")[1]-1),date.split("|")[1].split("/")[0]);
  }
    this.toString = function () {
    if (this.boss.word == "Knowledge"){
        return " ---> "+this.word+" <--- "
    }
    return this.boss.word+" => "+this.word+" ("+this.strength+") from "+this.from.getDate()+"/"+(this.from.getMonth()+1)+"/"+this.from.getFullYear()+" to "+this.to.getDate()+"/"+(this.to.getMonth()+1)+"/"+this.to.getFullYear();

    
    };
  this.removetag = function () {
        if (this.connections.length>0 && this.connections != null){
            for (var i=0;i<this.connections.length;i++){
                if (this.connections[i] != null){
                this.connections[i].line.hide();
                this.connections[i].bg.hide();
                this.connections.splice(i);
                
                // delete(this.connections[i]);//.remove()
            }
            }
            this.collections = [];
        }
        if (this.textbubble != null){
            this.textbubble.remove();
            this.box.remove();
            delete(this.box);
            delete(this.textbubble);
        }
        if (this.shadow != null){
            this.shadow.remove();
            delete(this.shadow);
        }
    };
}

Raphael.fn.drawtag = function (sometag) {
    if (sometag.textbubble == null){
    var xsize = $(window).width();
    var ysize = $(window).height();
    sometag.textbubble = this.text(xsize+150,55,sometag.word).attr(textattr).attr({font: "12px Helvetica, Arial"});
    sometag.textbubble.dad = sometag;
    var text_info   = sometag.textbubble.getBBox(false);
    sometag.box        = this.rect($(window).width()/2-text_info["width"]/2-12,($(window).height()-55)/2+55-text_info["height"]/2-4,text_info["width"]+24,text_info["height"]+9,5).attr(boxparams);
    sometag.box.dad = sometag;
    sometag.connections = [];
    if (sometag.boss.word == "Knowledge"){
        sometag.shadow = this.ellipse(text_info["x"]+text_info["width"]/2, text_info["y"]+text_info["height"]/2, 250, 200).attr({fill: "rhsb(0.7,0, 0)-hsb(0.172 , 1, .12)", stroke: "none", opacity: 0}).toBack();
        sometag.shadow.dad = sometag;
        sometag.textbubble.attr({font: "14px Helvetica, Arial", "font-weight": "bold"});
        sometag.box.dblclick( function (evt) {evt.preventDefault();sometag.florify(tags);});
        sometag.textbubble.dblclick( function (evt) {evt.preventDefault();sometag.florify(tags);});
        sometag.box.node.oncontextmenu =function(){return false;}
        sometag.textbubble.node.oncontextmenu =function(){return false;}
        sometag.box.mousedown( function (evt) {
            if (evt.button == 2) {
            evt.preventDefault();
            sometag.trunkify(tags);
            }});
        sometag.textbubble.mousedown( function (evt) {
            if (evt.button == 2) {
            evt.preventDefault();
            sometag.trunkify(tags);
            }});
    }
    else {

        this.drawtag(sometag.boss);
        var bond = this.connection(sometag.box,sometag.boss.box,"#000", "#fff|3");
        sometag.connections.push(bond);
        sometag.boss.connections.push(bond);
    }
    sometag.box.toFront();
    sometag.box.drag(dragMove,dragStart,dragStop);
    sometag.textbubble.drag(dragMove,dragStart,dragStop);
    sometag.textbubble.toFront();
    sometag.MoveTo(xsize/2+(Math.pow(Math.random(),3)-0.5)*xsize*0.9,(ysize+80)/2+(Math.pow(Math.random(),3)-0.5)*(ysize-80)*0.9, 500);
    
}

}

var boss = new tag("Quantum Physics", 1, null, null);
var web2o = new tag("Web 2.0", 1, null, null);
var tags = [
boss, web2o,
new tag("Quantum Mechanics",1,"02/02/1999|9/11/2008",boss),
new tag("Elementary Particle", 1, "02/02/1999|9/11/2008", boss),
new tag("Momentum",1,"08/10/2001|6/3/2008",boss),
new tag("Probability", 1, "31/01/2003|24/12/2012", boss),
new tag("Wave Function", 1, "07/09/2000|10/01/2011", boss),
new tag("Classical Physics", 1, "02/05/2001", boss),
new tag("Physics", 1, "11/06/2002", boss),
new tag("Physics",1, "02/10/2004|10/05/2012", boss),
new tag("Quantum State",1,"08/08/2006|10/12/2010", boss),
new tag("Albert Einstein", 1, "02/06/1995",boss),
new tag("HTML5", 1, "02/06/2011",web2o),
new tag("Steve Jobs", 1, "02/06/1995",web2o),
new tag("iOS", 1, "02/06/1995",web2o),
new tag("Updates", 1, "02/06/1995",web2o),
new tag("Post-PC", 1, "02/06/1995",web2o),
new tag("CSS3", 1, "02/06/1995",web2o),
new tag("Web-sockets", 1, "02/06/1995",web2o),
new tag("Rehash", 1,  "29/03/2012|31/03/2012",web2o),
new tag("Torrent", 1,  "01/04/2012|06/04/2012",web2o),
new tag("Ruby", 1,  "01/04/2012|05/04/2012",web2o),
new tag("Cloud Power", 1, "18/03/2012|22/03/2012",web2o),
];

var bckgrnd            = "rgb(254,254,254)";
var bckgrnddark        = "rgb(25,26,25)";
var btntheme           = 'rgb(239,240,241)-'+bckgrnd;
var textattr           = {font: '14px Helvetica, Arial', fill: "white", cursor: "pointer", "font-weight": "regular", "fill":"rgb(230, 245, 230)", "text-anchor":"middle"};
var subtitleattr       = {font: '12px Menlo, Helvetica, Arial', "font-weight": "regular", "fill":"rgb(230, 235, 230)", "text-anchor":"middle"};
var monthattr          = {font: '12px Menlo, Helvetica, Arial', "font-weight": "regular", "fill":"rgba(230, 235, 230,0.5)", "text-anchor":"middle", cursor: "default"};
var unhoveredbtntext   = {fill:"rgb(166, 166, 166)"};
var buttontext         = {font: '14px Helvetica, Arial',"text-anchor": "start","fill":"rgb(166, 166, 166)",cursor: "pointer"};
var hoveredbtntext     = {fill:"rgb(140,145,140)"};
var pressedbtntext     = {fill:"rgb(120, 125, 120)"};
var pluspressed        = {fill:"r(0.5, 0.9)rgb(117, 228, 44)-rgb(0, 219, 62)"};
var minuspressed       = {fill:"r(0.5, 0.9)rgb(240, 70, 30)-rgb(200, 40, 0)"};
var dotunhovered       = {fill:"rgb(35,36,35)", "stroke-width": 5, "stroke-opacity": "0", rx: "2", ry:"2", "stroke": "rgb(0,0,0)"};
var dothovered         = {fill:"rgb(166,166,166)", "stroke-width": 7, rx: "5", ry:"5"};
var dotunhoveredweekly = {fill:"rgb(45,46,45)", "stroke-width": 4, "stroke-opacity": "0", rx: "4", ry:"4", "stroke": "rgb(0,0,0)"};
var dothoveredweekly   = {fill:"rgb(170,170,170)", "stroke-width": 5, rx: "6", ry:"6"};
var bracketattr        = {fill:"rgb(169, 125, 247)", "stroke-width": 3, "stroke-opacity": 1, stroke: "rgb(199, 172, 247)",cursor:"col-resize"};
var boxparams          ={fill: "rgb(26, 65, 48)", stroke: "rgb(33, 113, 87)","fill-opacity": 1, "stroke-width": 2};
var timebarthickness   = 30;
var matches            = 0;
var updateconnections  = false;
var bracket;
var topbar;
var timebar;
var dots;
var R;
var T;


/*
┌───────────────────────────────────────────────────────────┐
│         MAIN FUNCTION & WINDOW REDRAWS                    │
└───────────────────────────────────────────────────────────┘ 
*/
        

$(window).resize(function(){
    if (timebar != null){
    w = $(window).width();
    h = $(window).height();
    bracket.attr({x: w+bracket.offset});
    dots = R.dotify(timebar);
    if (bracket.offset>=-40 && bracket.attr("width") <=20){
        // PUSHED TOO FAR RIGHT
        bracket.offset=-60;
        bracket.attr({x: w-60, width: 20, fill: "white"});
        bracket.animate(bracketattr, 200);
        
    }
    else if (bracket.offset+bracket.attr("width")>-60){
        if (bracket.attr("width")==20 && bracket.offset<=-40){ // i.e. if too small
            // TOO SMALL
            bracket.offset = -60;
            bracket.attr({x: w-60, width : 20, fill: "white"});
            bracket.animate(bracketattr, 200);
        
        }
        else if (-bracket.offset-bracket.attr("width")<20){ // if spilling over right
            // SPILLING RIGHT
            bracket.attr({width:Math.max(-(bracket.offset)-40,20),fill: "white"});
            if (bracket.offset>-60){
                bracket.attr({x:w-60});
                bracket.offset=-60;
            }
            bracket.animate(bracketattr, 200);
        }
        else{}
    }
    else if (bracket.attr("x")-20<w%40){ 
        // SPILLING LEFT
        var extra = bracket.offset-20+w;
        bracket.offset = 40-w;
        bracket.attr({x: 20+w%40, width: Math.max(bracket.attr("width")+extra+20,20), fill: "white"});
        bracket.animate(bracketattr, 200);
    }
    else {}

    if ((bracket.attr("width")+80)>w){
        // TOO BIG
        var remainder = w%40;
        if (remainder < 20){
            remainder += 20;
        }{}
        bracket.attr({x: remainder, width: w-40-w%40, fill: "white" });
        bracket.animate(bracketattr, 200);
    }
}
});
$("document").ready( function () {
    console.log("hello");
    $("svg").bind("dragstart", function (e){
        
        e.preventDefault();

});
    console.log("solved");
});
window.onload = function () {
    if(typeof(Storage)!=="undefined")
        {
        $.fancybox({
                'overlayShow'   : true,
                'transitionIn'  : 'elastic',
                'transitionOut' : 'elastic',
                'overlayColor'  : '#000',
                'overlayOpacity': 0.3,
                'href'          : '#namebox'
            });
        $("#firstnameval").attr("placeholder",localStorage.firstname || "Firstname,");
        $("#lastnameval").attr("placeholder",localStorage.lastname || "lastname...");
        $("#userid").text(localStorage.firstname || "visitor");
        $("#firstnameval").focus();
        }
    else
        {
        console.log("no local storage :(");
        }
    R      = Raphael("canvas");
    T      = Raphael("canvas");
    topbar = R.rect(0, 0,"100%",55,0).attr({fill:bckgrnd, stroke:"         none"});
    // R.timeline(tags);
    R.backbutton(10,10,"back");
    R.setSize("100%","100%");
    T.setSize(100,55);
    R.canvas.setAttribute('id','leftbar');
    T.canvas.setAttribute('id','rightbar');
    $("#leftbar").css({position:"absolute", top:0,"z-index": 100});
    $("#rightbar").css({position: "absolute", top:0, right: 0, "z-index": 400});
    T.forwardbutton(0,10, "next");
    R.blockbutton(200,10, "Questions? Answers? Fixes? Bugs? Talk to");
    R.plusbutton(490,10, "Jonathan Raiman").attr({href:"mailto:jonathan.raiman@pomona.edu"});
    R.minusbutton(670,10, "");
    matches = R.drawalltags(tags);
    web2o.MoveTo(250,200);
    // web2o.florify(tags);
    boss.MoveTo(800,600);
    // boss.florify(tags);
};
$("#nameform").live('submit', function (){
    localStorage.firstname = $("#firstnameval").val();
    localStorage.lastname = $("#lastnameval").val();
    $.fancybox.close();
});

Raphael.fn.timeline = function (array){
    var text ="";
    for (var i=0;i<array.length;i++){
        text += array[i]+"\n";
        }
    
    timebar        = this.rect(0, 55,"100%",timebarthickness,0).attr({fill:bckgrnddark, stroke:"none"});
    bracket        = this.rect($(window).width()-240,59,200,timebarthickness-8,8).attr(bracketattr);
    bracket.offset =-240;
    bracket.drag(sliderresize,sliderdragStart,sliderdragStop);
    dots         = R.dotify(timebar);
    bracket.to   = dots[Math.max(((-bracket.offset-40)/20-bracket.attr("width")/20),0)].dotdate;
    bracket.from = dots[Math.min((-bracket.offset-40)/20, dots.length-1)].dotdate;
    
}
/*
┌───────────────────────────────────────────────────────────┐
│         TAG SEARCH, FILTERING, & REDRAWING                │
└───────────────────────────────────────────────────────────┘ 
*/


Raphael.fn.drawtags = function (words){
    var acceptable = [];
    var text;
    try {var from = dots[Math.min((-bracket.offset-40)/20, dots.length-1)].dotdate;}
    catch (e) {if(e == TypeError){}}
    try{ var to =dots[Math.max(((-bracket.offset-40)/20-bracket.attr("width")/20),0)].dotdate;
    } catch (e) {if (e == TypeError){}}
    var xsize = $(window).width();
    var ysize = $(window).height();
    for (var i=0;i<words.length;i++){
        try{if (words[i].to >= from && words[i].to <= to){
            acceptable.push(words[i]);
        }
        else {
            words[i].removetag();
        }
        } catch (e) {if (e == TypeError){}}
    }
    text= "matches = "+acceptable.length+"\n";
    for (var j=0;j<acceptable.length;j++){
        text += acceptable[j]+"\n";
        this.drawtag(acceptable[j]);
        
    }

    console.log(text);
    return acceptable.length;
}

Raphael.fn.drawalltags = function (words){
    var acceptable = [];
    var text;
    var from = new Date(0);
    var to = new Date();
    var xsize = $(window).width();
    var ysize = $(window).height();
    for (var i=0;i<words.length;i++){
        try{if (words[i].to >= from && words[i].to <= to){
            acceptable.push(words[i]);
        }
        else {
            words[i].removetag();
        }
        } catch (e) {if (e == TypeError){}}
    }
    text= "matches = "+acceptable.length+"\n";
    for (var j=0;j<acceptable.length;j++){
        text += acceptable[j]+"\n";
        this.drawtag(acceptable[j]);
        
    }

    console.log(text);
    return acceptable.length;
}

/*
┌───────────────────────────────────────────────────────────┐
│         TIMELINE DOT ITEM CREATION & MAINTENANCE          │
└───────────────────────────────────────────────────────────┘ 
*/

Raphael.fn.dotify = function (object){
    if (dots != null){ // REMOVE PREVIOUS DOTS
    for (var i =0 ; i<dots.length; i++){
        if (dots[i].monthtitle != null){ // if dot has a month label below it, remove it
            dots[i].monthtitle.remove();
        }
        dots[i].remove();
    }
    dots = null;
    };
    var newdots = this.set();
    var offset = 40;
    var offsetting = 20;
    var box = object.getBBox(false);
    for (var i =0; i<Math.floor($(window).width()/offsetting-2);i++){
        newdots.push(this.dot($(window).width()-offset,object.attr("y")+object.attr("height")/2,i));
        offset += offsetting;
    }
    return newdots;
}

Raphael.fn.dot = function(x,y, increment){
    var dot     = this.ellipse(x,y,2,2).attr(dotunhovered);
    var months  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    dot.dotdate = new Date();
    dot.dotdate.setDate(dot.dotdate.getDate()-increment);

    if (increment>7){
        
        dot.date = dot.dotdate.getDate()+"/"+(dot.dotdate.getMonth()+1)+"/"+dot.dotdate.getFullYear();
    }
    else {
        dot.date = increment + " days ago";
    }

    if (increment%7==0){
        dot.attr(dotunhoveredweekly);
        dot.date = (increment/7) + " weeks ago";
        dot.mouseover(function (){this.hovereddotweekly();});
        dot.mouseout(function (){this.unhovereddotweekly();});
        if (increment == 7){
            dot.date = "a week ago";
        }
        else if (increment == 0){
            dot.date = "today";
        }
    }
    else {
        dot.mouseover(function (){this.hovereddot();});
        dot.mouseout(function (){this.unhovereddot();});
    }

    if (dot.dotdate.getDate() == 1){
        dot.monthtitle = this.text(x,y+30,months[dot.dotdate.getMonth()]).attr(monthattr).transform("r90");
        dot.monthtitle.toFront();
    }
    return dot;
}


/*
┌───────────────────────────────────────────────────────────┐
│ UI ITEMS, JAVASCRIPT SELECTORS, & RAPHAEL ELEMENT METHODS │
└───────────────────────────────────────────────────────────┘ 
*/

Raphael.fn.backbutton = function (x,y, text, callback){
    var text = this.text(x+16, y+17,text || "").attr(buttontext);
    var button = this.path("m"+(x+12+10+text.getBBox(false)["width"])+","+(y+30)+"c0,4-4,4-4,4"+"h-"+(text.getBBox(false)["width"]+2)+"l-12,-17"+"l12,-17"+"h"+(text.getBBox(false)["width"]+2)+"c0,0,4,0,4,4z")
        .attr({fill: '90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    var set = this.set(button,text);
        Raphael($(text[0]).css({"text-shadow": "1px 1px white"}));
        set.mouseover(function () {button.hovered();text.hovered();});
        set.mouseout(function () {button.unhovered();text.unhovered();});
        set.mousedown(function (e) {e.preventDefault(); button.pressed();text.pressed();});
        set.mouseup(function () {button.unpressed();text.unpressed();});
        set.click(callback);
        text.toFront();
    
        // button.click({fill:})

    return set;
}

Raphael.fn.forwardbutton = function (x,y, text, callback){
    var text = this.text(x+5, y+17,text || "").attr(buttontext);
    var button = this.path("m"+(x+text.getBBox(false)["width"]+5)+","+(y)+"l12,17"+"l-12,17"+"h-"+text.getBBox(false)["width"]+
        "c0,0,-4,0,-4,-4"+"v-26"+"c0,0,0,-4,4,-4z")
        .attr({fill: '90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    var set = this.set(button,text);
        Raphael($(text[0]).css({"text-shadow": "1px 1px white"}));
        set.mouseover(function () {button.hovered();text.hovered();});
        set.mouseout(function () {button.unhovered();text.unhovered();});
        set.mousedown(function (e) {e.preventDefault(); button.pressed();text.pressed();});
        set.mouseup(function () {button.unpressed();text.unpressed();});
        set.click(callback);
        text.toFront();
    
        // button.click({fill:})

    return set;
}

Raphael.fn.plusbutton = function (x,y, text, callback){
    
    // var text = this.text(x+5, y+17,text || "").attr(buttontext);
    var circle = this.ellipse(x+12,y+17,6,6).attr({fill:"rgb(166,166,166)", "stroke-width": 0, cursor: "pointer"});
    var underlinecircle = this.ellipse(x+12,y+18,6,6).attr({fill:"white", "stroke-width": 0, cursor: "pointer"});
    var icon = this.path("m"+(x+11)+","+(y+16)+"v-3h2v3h3v2h-3v3h-2v-3h-3v-2z").attr({fill:"rgb(254,254,254)", "stroke-width": 0,cursor: "pointer"});
    var text = this.text(x+20, y+17, text || "").attr(buttontext);
    var button = this.rect(x,y,text.getBBox(false)["width"]+25,34,4)
        .attr({fill: '90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    var set = this.set(icon,circle, underlinecircle, text, button);
        Raphael($(text[0]).css({"text-shadow": "1px 1px white"}));
        set.mouseover(function () {button.hovered();text.hovered(); circle.hovered();});
        set.mouseout(function () {button.unhovered();text.unhovered();circle.unhovered();});
        set.mousedown(function (e) {e.preventDefault(); button.pressed();text.pressed();circle.attr(pluspressed);});
        set.mouseup(function () {button.unpressed();text.unpressed();circle.unpressed();});
        set.click(callback);
        underlinecircle.toFront();
        text.toFront();
        circle.toFront();
        icon.toFront();
    
        // button.click({fill:})

    return set;
}

Raphael.fn.minusbutton = function (x,y, text, callback){
    
    // var text = this.text(x+5, y+17,text || "").attr(buttontext);
    var circle = this.ellipse(x+12,y+17,6,6).attr({fill:"rgb(166,166,166)", "stroke-width": 0, cursor: "pointer"});
    var underlinecircle = this.ellipse(x+12,y+18,6,6).attr({fill:"white", "stroke-width": 0, cursor: "pointer"});
    var icon = this.path("m"+(x+11)+","+(y+16)+"h5v2h-8v-2z").attr({fill:"rgb(254,254,254)", "stroke-width": 0,cursor: "pointer"});
    var text = this.text(x+20, y+17, text || "").attr(buttontext);
    var button = this.rect(x,y,text.getBBox(false)["width"]+25,34,4)
        .attr({fill: '90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    var set = this.set(icon,circle, underlinecircle, text, button);
        Raphael($(text[0]).css({"text-shadow": "1px 1px white"}));
        set.mouseover(function () {button.hovered();text.hovered(); circle.hovered();});
        set.mouseout(function () {button.unhovered();text.unhovered();circle.unhovered();});
        set.mousedown(function (e) {e.preventDefault(); button.pressed();text.pressed();circle.attr(minuspressed);});
        set.mouseup(function () {button.unpressed();text.unpressed();circle.unpressed();});
        set.click(callback);
        underlinecircle.toFront();
        text.toFront();
        circle.toFront();
        icon.toFront();
    
        // button.click({fill:})

    return set;
}

Raphael.fn.blockbutton = function (x,y, text, callback){
    var text = this.text(x+5, y+17, text || "").attr(buttontext);
    var button = this.rect(x,y,text.getBBox(false)["width"]+10,34,4)
        .attr({fill: '90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    var set = this.set(button,text);
        Raphael($(text[0]).css({"text-shadow": "1px 1px white"}));
        set.mouseover(function () {button.hovered();text.hovered();});
        set.mouseout(function () {button.unhovered();text.unhovered();});
        set.mousedown(function (e) {e.preventDefault(); button.pressed();text.pressed();});
        set.mouseup(function () {button.unpressed();text.unpressed();});
        set.click(callback);
        text.toFront();

    return set;
}

Raphael.el.hovered = function (){
    if (this.type == "path" || this.type == "rect"){
    this.attr({fill:'90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    }
    else if (this.type == "text" || this.type =="ellipse"){
                this.attr(hoveredbtntext);
            }
    else {
    }
}

Raphael.el.pressed = function (){
    if (this.type == "path" || this.type == "rect"){
    this.attr({fill:'270-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    }
    else if (this.type == "text"){
                this.attr(pressedbtntext);
            }
    else {
    }
}


Raphael.el.unhovered = function (object){
    if (this.type == "path" || this.type == "rect"){
    this.attr({fill:'90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    }
    else if (this.type == "text" || this.type =="ellipse"){
                this.attr(unhoveredbtntext);
            }
    else {
    }
}

Raphael.el.unpressed = function (object){
    if (this.type == "path" || this.type == "rect"){
    this.attr({fill:'90-'+btntheme,'stroke-width': '1.5', 'stroke':'#C2C3C5', 'stroke-opacity': '1','cursor':'pointer'});
    }
    else if (this.type == "text" || this.type == "ellipse"){
                this.attr(hoveredbtntext);
            }
    else {
    }
}

Raphael.el.hovereddot = function (){
    this.animate(dothovered, 200);
    var box = this.getBBox(false);
    this.subtitle = R.subtitle(box["x"]+box["width"]/2,box["y"]+box["width"]/2+25,this.date);
    this.subtitle.animate({"fill-opacity":1},200);
}

Raphael.el.unhovereddot = function (object){
    this.animate(dotunhovered, 200);
    this.subtitle.animate({"fill-opacity":0},200, function() {
        if (this.subtitle != null){
        this.subtitle.remove();
        }
    });
}

Raphael.el.hovereddotweekly = function (){
    this.animate(dothoveredweekly, 200);
    var box = this.getBBox(false);
    this.subtitle = R.subtitle(box["x"]+box["width"]/2,box["y"]+box["width"]/2+25,this.date);
    this.subtitle.animate({"fill-opacity":1},200);
}

Raphael.el.unhovereddotweekly = function (object){
    this.animate(dotunhoveredweekly, 200);
    this.subtitle.animate({"fill-opacity":0},200, function() {
        if (this.subtitle != null){
        this.subtitle.remove();
        }
    });
}

Raphael.fn.subtitle = function (x,y,text){
    return this.text(x,y,text).attr(subtitleattr);
}

function hasClass (el, enquiry){
        for (var i=0;i<el.getAttribute("class").split(" ").length;i++){
            if (el.getAttribute("class").split(" ")[i]==enquiry){
                return true;
                break;
            }
        }
        return false;
}

function addClass(el, addition){
        if (hasClass(el,addition)==false){
            el.setAttribute("class",el.getAttribute("class").split(/\W+/).join(" ")+" "+addition);
            return el;
        }
        return el;
}

function removeClass(el, substraction){
        
        el.setAttribute("class", el.getAttribute("class").split(substraction).join(""));
        return el;
}

var dt = 100;
setInterval ( function () {
    if (updateconnections){
        for (var i =0; i<tags.length; i++) {
            for (var j=0;j<tags[i].connections.length;j++){
                R.connection(tags[i].connections[j]);
            }
            
        }
        updateconnections = false;
    }
}
    , dt );


/*
┌───────────────────────────────────────────────────────────┐
│           CONNECTIONS, CLOUD MOTIONS, & FLOWERS           │
└───────────────────────────────────────────────────────────┘ 
*/

tag.prototype.florify = function (group){
    R.drawtag(this);
    var separation = 10;
    var pitch = 0;
    var xradius = 180;
    var yradius = 0.5*xradius;
    var currentpitch =0;
    var box = this.box.getBBox(false);
    if (this.boss.word == "Knowledge"){
        var children = [];
        for (var i=0; i<group.length; i++){
            if (group[i].boss == this){
                children.push(group[i]);
            }
        }
        if (children.length>0){
            pitch = 2*Math.PI/children.length;
        }
        for (var j=0;j<children.length;j++){
            children[j].MoveTo(box["x"]+xradius*Math.cos(currentpitch)-box["width"]/2,box["y"]+yradius*Math.sin(currentpitch)-box["height"]/2);
            currentpitch += pitch;
        }
    }
}

tag.prototype.trunkify = function (group){
    R.drawtag(this);
    var box = this.box.getBBox(false);
    var separation = 20;
    var floorheight = box["height"]*1.5;
    var maxwidth = 600;
    var maxelwidth = 0;
    var elperfloor = 0;
    if (this.boss.word == "Knowledge"){
        var children = [];
        for (var i=0; i<group.length; i++){
            if (group[i].boss == this && group[i].box){
                children.push(group[i]);
                if (group[i].box.getBBox(false)["width"]>maxelwidth){
                    maxelwidth=group[i].box.getBBox(false)["width"];
                }
            }
        }
        if (children.length>0){
            elperfloor = Math.floor(maxwidth/(maxelwidth+separation));
        }
        var starposition = box["x"]+box["width"]/2-elperfloor*0.5*(maxelwidth+2*separation);
        var currentfloor = 1;
        var onthisfloor = 0;
        for (var h=0;h<children.length;h++){
                onthisfloor++;
                starposition -= children[h].box.getBBox(false)["width"]/2;
                children[h].MoveTo(starposition,
                    box["y"]+currentfloor*floorheight);
                starposition += children[h].box.getBBox(false)["width"]/2+maxelwidth+separation;
                if (onthisfloor == elperfloor+1){
                    onthisfloor = 0;
                    currentfloor++;
                    if (elperfloor>1){
                        elperfloor--;
                        starposition = box["x"]+box["width"]/2-elperfloor*0.5*(maxelwidth+separation);
                    }
                    else {
                        starposition= box["x"]-box["width"]/2;
                    }   //-(maxelwidth+separation)*elperfloor/2+(h%elperfloor)*(maxelwidth+separation/2)
                }
        }
    }
}

tag.prototype.MoveTo = function (x,y, speed){
    var dt = 300;
    if (speed != null){
        dt = speed;
    }
        if (this.textbubble != null){
            this.textbubble.animate({x: x+this.box.attr("width"), y: y+this.box.attr("height")}, dt, function () {if (updateconnections == false){ updateconnections = true;}});
        }
        if (this.shadow != null){
            this.shadow.animate({cx: x+this.box.attr("width"), cy: y+this.box.attr("height")}, dt, function () {if (updateconnections == false){ updateconnections = true;}});
        }
        if (this.box != null){
            this.box.animate({x: x+this.box.attr("width")/2, y: y+this.box.attr("height")/2}, dt, function () {if (updateconnections == false){ updateconnections = true;}});
        }
}

Raphael.fn.ShowDelta = function (results){

    var text = "";
    if (results-matches>0){
        text = "+";
    }
    text +=(results-matches);
    if (results-matches == 0){
    }
    else {
        var resultwindow = this.rect($(window).width()-75,$(window).height()-75,70,70,20).attr({fill: "rgba(0,0,0,0.3)", "stroke-opacity":0});
        var resultwindowtext = this.text($(window).width()-40,$(window).height()-40,text).attr({font: "18px Menlo, Helvetica, Arial", fill:"white",cursor:"default"});
        if (results-matches<0){
            resultwindowtext.attr({fill:"red"});
        }
        matches = results;
        resultwindow.toFront();
        resultwindowtext.toFront();
        resultwindow.animate({"fill-opacity":0},800);
        resultwindowtext.animate({"fill": "rgb(230, 245, 230)", "fill-opacity":0},800, function () {resultwindow.remove(); resultwindowtext.remove();});
    }
}

Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    if (obj1 != null && obj2 != null){
    try {var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];}
    catch (e){
        if (e==TypeError){}
    }
    }
    try {for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    } catch (e){if (e==TypeError){}}
    try {if (dis != null && dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    } catch (e) { if (e == TypeError){}}
    try { var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    path.toBack();
    } catch (e) { if (e == TypeError){}}
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }

};

/*
┌───────────────────────────────────────────────────────────┐
│           "VANILLA" TAG DRAGGING (NO RESTRICTIONS)        │
└───────────────────────────────────────────────────────────┘ 
*/

function dragStart () {
this.ox = this.attr("x");
this.oy = this.attr("y");
if (this.dad.textbubble != null && this.dad.textbubble != this){

    this.dad.textbubble.ox = this.dad.textbubble.attr("x");
    this.dad.textbubble.oy = this.dad.textbubble.attr("y");   
}
if (this.dad.box != null && this.dad.box != this){
    this.dad.box.ox = this.dad.box.attr("x");
    this.dad.box.oy = this.dad.box.attr("y");   
}
if (this.dad.shadow != null){
    this.dad.shadow.ox = this.dad.shadow.attr("cx");
    this.dad.shadow.oy = this.dad.shadow.attr("cy");   
}
}
function dragMove (dx,dy){
this.attr({ x: this.ox +dx, y: this.oy+dy});
if (this.dad.textbubble != null && this.dad.textbubble != this){
    this.dad.textbubble.attr({x: this.dad.textbubble.ox +dx, y: this.dad.textbubble.oy +dy});
}
if (this.dad.shadow != null){
    this.dad.shadow.attr({cx: this.dad.shadow.ox+dx, cy: this.dad.shadow.oy+dy});
}
if (this.dad.box != null && this.dad.box != this){
    this.dad.box.attr({x: this.dad.box.ox+dx, y: this.dad.box.oy+dy});
}
for (var i =0; i<this.dad.connections.length; i++) {
    R.connection(this.dad.connections[i]);
}
}
function dragStop(){
if (this.dad.textbubble != null && this.dad.textbubble != this){
    delete(this.dad.textbubble.ox);
    delete(this.dad.textbubble.oy);}
if (this.dad.box != null && this.dad.box != this){
    delete(this.dad.box.ox);
    delete(this.dad.box.oy);}
if (this.dad.shadow != null){
    delete(this.dad.shadow.ox);
    delete(this.dad.shadow.oy);}
delete(this.ox);
delete(this.oy);

}

/*
┌───────────────────────────────────────────────────────────┐
│      SLIDER "BRACKET" MOTIONS & RESTRICTED "X" TRAVEL     │
└───────────────────────────────────────────────────────────┘ 
*/

function sliderdragStart  (x,y) {
this.mousex    = x;   
this.ox        = this.attr("cx") || this.attr("x");
this.ow        = this.attr("width") || 0;
this.oy        = this.attr("cy") || this.attr("y");

}
function sliderdrag (dx, dy) {
this.attr({ cx: this.ox + dx, x:this.ox + dx});
}
function sliderresize (dx, dy) {
if (this.mousex>this.ox+this.ow/2){
    if (this.ow+ Math.floor(dx/20)*20<20){
        this.attr({ width: 20, x: this.ox + this.ow+Math.floor(dx/20)*20});
    }
    else {
        this.attr({ width: this.ow + Math.floor(dx/20)*20});
    }
}
else  {
    if (this.ow - Math.floor(dx/20)*20 < 20){
        this.attr({ width: 20, x: this.ox + Math.floor(dx/20)*20});
    }
    else {
    this.attr({ width: this.ow - Math.floor(dx/20)*20, x: this.ox + Math.floor(dx/20)*20});
    }
}
}

function sliderdragStop() {
var context = $(window).width();
this.offset = this.attr("x")-context;
if (this.offset>=-40 && this.attr("width") <=20){
    // PUSHED TOO FAR RIGHT
    this.offset=-60;
    this.attr({x: context-60, width: 20, fill: "white"});
    this.animate(bracketattr, 200);
    
}
else if (this.offset+this.attr("width")>-60){
    if (this.attr("width")==20 && this.offset<=-40){ // i.e. if too small
        // TOO SMALL
        this.offset = -60;
        this.attr({x: context-60, width : 20, fill: "white"});
        this.animate(bracketattr, 200);
    
    }
    else if (-this.offset-this.attr("width")<20){ // if spilling over right
        // SPILLING RIGHT
        this.attr({width:Math.max(-(this.offset)-40,20),fill: "white"});
        if (this.offset>-60){
            this.attr({x:context-60});
            this.offset=-60;
        }
        this.animate(bracketattr, 200);
    }
    else{}
}
else if (this.attr("x")-20<context%40){ 
    // SPILLING LEFT
    var extra = this.offset-40+context;
    this.offset = 40-context;
    this.attr({x: 20+context%40, width: Math.max(this.attr("width")+extra,20), fill: "white"});
    this.animate(bracketattr, 200);
}
else {}

if ((this.attr("width")+80)>context){
    // TOO BIG
    var remainder = context%40;
    if (remainder < 20){
        remainder += 20;
    }
    this.attr({x: remainder, width: context-40-remainder, fill: "white" });
    this.animate(bracketattr, 200);
}
delete(this.ox);
delete(this.ow);
delete(this.oy);
R.ShowDelta(R.drawtags(tags));
}