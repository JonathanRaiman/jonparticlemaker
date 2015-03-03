var attentionspan = [];
var canvases                    = {},
    canvasnumber                = 0,
    dragging                    = false,
    text_attr                   = {font: '14px Lucida Grande, Arial', fill: "white", cursor: "pointer", "font-weight": "bold", "text-anchor":"middle"},
    text_attr_expanded          = {font: '14px Lucida Grande, Arial', fill: "white", cursor: "pointer", "font-weight": "bold", "text-anchor":"middle"},
    boxparams                   = {fill: "270-rgb(62,170,29)-rgb(62,170,0)", stroke: "rgb(54,124,0)","fill-opacity": 1, "stroke-width": 1.5},
    boxparams_expanded          = {fill: "270-rgb(98,139,240)-rgb(19,86,227)", stroke: "rgb(45, 62, 87)","fill-opacity": 1, "stroke-width": 1},
    memoparams                  = {fill: "270-rgb(70,157,206)-rgb(88,167,211)", stroke: "rgb(56,125,164)","fill-opacity": 1, "stroke-width": 1.5},
    memoparams_expanded         = {fill: "270-rgb(72,176,234)-rgb(72,176,234)", stroke: "rgb(56,125,164)","fill-opacity": 1, "stroke-width": 1.5},
    memoparams_bw               = {fill: "270-rgb(246,246,246)-rgb(246,246,246)", stroke: "rgb(170,170,170)","fill-opacity": 1, "stroke-width": 1.5},
    memoparams_bw_text          = {font: '14px Lucida Grande, Arial', fill: "rgb(147,148,148)", cursor: "pointer", "font-weight": "bold", "text-anchor":"middle"}
    memoparams_bw_expanded      = {fill: "270-rgb(254,254,254)-rgb(254,254,254)", stroke: "rgb(150,150,150)","fill-opacity": 1, "stroke-width": 1.5},
    memoparams_bw_text_expanded = {font: '14px Lucida Grande, Arial', fill: "#333", cursor: "pointer", "font-weight": "bold", "text-anchor":"middle"};
// $( function() {
//     $("svg").bind("dragstart", function (e){
        
//         e.preventDefault();
//     });
// });
function get_memo_rules (o) {
    var el = o["el"],
        parent_el = el,
        tags = [{"name":"HANA Campaign 1","max connections":999,"connects_to":"answer", "type":"memo", "appearance":memoparams_bw, "appearance_expanded":memoparams_bw_expanded, "text_attr":memoparams_bw_text, "text_attr_expanded":memoparams_bw_text_expanded},
        {"name":"HANA Response 1","max connections":999,"connects_to":"answer","type":"memo", "appearance":memoparams_bw, "appearance_expanded":memoparams_bw_expanded, "text_attr":memoparams_bw_text, "text_attr_expanded":memoparams_bw_text_expanded},
        {"name":"HANA Response 2","max connections":999,"connects_to":"answer","type":"memo", "appearance":memoparams_bw, "appearance_expanded":memoparams_bw_expanded, "text_attr":memoparams_bw_text, "text_attr_expanded":memoparams_bw_text_expanded},
        {"name":"Default","max connections":1,"connects_to":"memo","type":"answer"},
        {"name":"Telecommunications Industry","max connections":1,"connects_to":"memo","type":"answer"},
        {"name":"Pharmaceutical Industry","max connections":1,"connects_to":"memo","type":"answer"}],
        canvas_size = [640, 320];
    while (parent_el[0].tagName.toLowerCase() != "table"){
        parent_el = parent_el.parent();
    }
    var memo_rules = parent_el.parent().children(".memo_rules");
    if (memo_rules.children(".canvas").length>0){
        return canvases[memo_rules.children(".canvas").attr("data-canvas-name")];
        // rules already exist
    }
    else {
        var canvas = $("<div id='canvas_"+canvasnumber+"' class='canvas'></div>").appendTo(memo_rules),
            canvas_name = "canvas_"+canvasnumber,
            raphael_canvas = Raphael(canvas_name);
        canvases[canvas_name] = raphael_canvas;
        raphael_canvas.setSize(canvas_size[0],canvas_size[1]);
        canvas.attr("data-canvas-name",canvas_name);
        // attachment mode allows tags to be linked via connections
        raphael_canvas.attachment_mode = false;
        raphael_canvas.expandable_elements = [];
        canvasnumber++;
        $.each( tags, function (){
            var tag_box = raphael_canvas.draw_tag($(this)[0]["name"],canvas_size[0]/2,canvas_size[1]*0.95);
            tag_box.attr($(this)[0]["appearance"]);
            tag_box.dad.textbubble.attr($(this)[0]["text_attr"] ? $(this)[0]["text_attr"] : text_attr);
            tag_box.dad.o_type = $(this)[0]["type"];
            tag_box.dad.connects_to =$(this)[0]["connects_to"] ? $(this)[0]["connects_to"] : "all";
            tag_box.dad.max_connections = $(this)[0]["max connections"] ? $(this)[0]["max connections"] : 999;
            tag_box.dad.appearance = $(this)[0]["appearance"] ? $(this)[0]["appearance"] : boxparams;
            tag_box.dad.appearance_expanded = $(this)[0]["appearance_expanded"] ? $(this)[0]["appearance_expanded"] : boxparams_expanded;
            tag_box.dad.text_attr = $(this)[0]["text_attr"] ? $(this)[0]["text_attr"] : text_attr;
            tag_box.dad.text_attr_expanded = $(this)[0]["text_attr_expanded"] ? $(this)[0]["text_attr_expanded"] : text_attr_expanded;
        });
        return raphael_canvas;
    }
}

function memo_attachment_mode (o) {
    var el = o["el"],
        canvas = get_memo_rules (o),
        parent_el = el;
    while (parent_el[0].tagName.toLowerCase() != "table"){
        parent_el = parent_el.parent();
    }
    if (canvas.attachment_mode) {
        el.removeClass("expanded").addClass("salt");
        canvas.attachment_mode = false;
        for (var i = 0; i<canvas.expandable_elements.length;i++){
            canvas.expandable_elements[i].expand(false);
        }
    }
    else {
        el.removeClass("salt").addClass("expanded");
        canvas.attachment_mode = true;
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
if (this.paper.attachment_mode){
    dragging = true;
    if (!this.expanded){
        this.expand(true);
    }
    this.dragger = this.paper.ellipse(this.ox,this.oy,6,6).attr({fill:"rgb(166,166,166)", "stroke-width": 0, cursor: "default"});
    this.dragger.bond = this.paper.connection(this,this.dragger,"rgb(52,108,232)", "rgb(51,87,160)|5");
}
}
function dragMove (dx,dy){
    if (this.paper.attachment_mode){
        this.dragger.attr({ cx: this.ox +dx, cy: this.oy+dy});
        this.paper.connection(this.dragger.bond);
    }
    else {
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
            this.paper.connection(this.dad.connections[i]);
        }
    }
}
function dragStop(event){
if (this.paper.attachment_mode){
    dragging = false;
    var target_elements = this.paper.getElementsByPoint(this.dragger.attr("cx"),this.dragger.attr("cy"));
    for (var i=0; i<target_elements.length;i++){
        if (target_elements[i].type == "rect" && target_elements[i] != this && target_elements[i] != this.dad.box){
            // check if acceptable type
            if (target_elements[i].dad.o_type == this.dad.connects_to || this.dad.connects_to == "all"){
                var bond_present = false;
                this.expand(false);
                for (var j=0;j<this.dad.connections.length;j++){
                    if ((this.dad.connections[j].from == this.dad.box || this.dad.connections[j].from == target_elements[i]) && (this.dad.connections[j].to == this.dad.box || this.dad.connections[j].to == target_elements[i])){
                        // connection already exits
                        console.log(this.dad.connections[j]);
                        bond_present = true;
                        break;
                    }
                }
                if (!bond_present){
                    if (this.dad.max_connections == 1 && this.dad.connections.length>0){
                        this.dad.connections[0].bg.remove();
                        this.dad.connections[0].line.remove();
                        delete(this.dad.connections[0]);
                        this.dad.connections.splice(0);
                    }
                    if(this.dad.max_connections<= this.dad.connections.length){
                    }
                    else {
                        var bond = this.paper.connection(this.dad.box, target_elements[i], "rgb(52,108,232)", "rgb(51,87,160)|5")
                        bond.bg.bond = bond;
                        bond.line.bond = bond;
                        bond.bg.click( function () {
                            var from_connections = this.bond.from.dad.connections,
                                to_connections = this.bond.to.dad.connections;
                            for (var i=0;i<from_connections.length;i++){
                                if (from_connections[i] == this.bond){
                                    from_connections.splice(i);
                                }
                            }
                            for (var i=0;i<to_connections.length;i++){
                                if (to_connections[i] == this.bond){
                                    to_connections.splice(i);
                                }
                            }
                            this.bond.line.remove();
                            delete(this.bond);
                            this.remove();
                        });
                        bond.line.click( function () {
                            var from_connections = this.bond.from.dad.connections,
                                to_connections = this.bond.to.dad.connections;
                            for (var i=0;i<from_connections.length;i++){
                                if (from_connections[i] == this.bond){
                                    from_connections.splice(i);
                                }
                            }
                            for (var i=0;i<to_connections.length;i++){
                                if (to_connections[i] == this.bond){
                                    to_connections.splice(i);
                                }
                            }
                            this.bond.bg.remove();
                            delete(this.bond);
                            this.remove();
                        });
                        this.dad.connections.push(bond);
                        target_elements[i].dad.connections.push(bond);
                    }
                    }
            }
            break;
        }
    }
    this.dragger.bond.line.remove();
    this.dragger.bond.bg.remove();
    delete(this.dragger.bond);
    this.dragger.remove();
}
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

Raphael.fn.draw_tag = function (text,x,y) {
    var box_height = $(this.canvas).attr("height"),
        box_width = $(this.canvas).attr("width"),
        x_pos = (x >box_width) ? box_width : ((x < 0) ? 0 : x),
        y_pos = (y >box_height) ? box_height : ((y < 0) ? 0 : y),
        textbubble = this.text(x_pos,y_pos,text).attr(text_attr).attr({font: "12px Helvetica, Arial"}),
        textbubble_bbox = textbubble.getBBox(false),
        box = this.rect(x_pos-textbubble_bbox["width"]/2-12,y_pos-textbubble_bbox["height"]/2-4,textbubble_bbox["width"]+24,textbubble_bbox["height"]+9,5).attr(boxparams),
        o = {"textbubble" : textbubble, "box" : box, "connections" : []},
        canvas = this;
    textbubble.dad = o;
    box.dad = o;
    box.expanded = false;
    box.toFront();
    box.drag(dragMove,dragStart,dragStop);
    textbubble.drag(dragMove,dragStart,dragStop);
    textbubble.toFront();
    this.expandable_elements.push(box);
    return box;
}

Raphael.el.expand = function (choice){
    if (this.expanded != choice){
        if (this.type == "rect"){
            this.attr(choice ? this.dad.appearance_expanded : this.dad.appearance);
            this.dad.textbubble.attr(choice ? this.dad.text_attr_expanded : this.dad.text_attr);
            this.dad.textbubble.expanded = choice;
            this.expanded = choice;
        }
        else if (this.type == "text"){
            this.attr(choice ? this.dad.text_attr_expanded : this.dad.text_attr);
            this.dad.box.attr(choice ? this.dad.appearance_expanded : this.dad.appearance);
            this.expanded = choice;
            this.dad.box.expanded = choice;
        }
    }
}