/*
 *
 *           TEXT INPUT
 *
 */
var messages = [];
var tags =[{title:"Web 2.0",words:["HTML5","Steve Jobs","iOS","Updates","Post-PC","CSS3","Web-sockets"]},{title:"Streaming",words:["Spotify","iTunes","Amazon Cloudrive","Google Play","Pandora","Youtube","HTML5","Steve Jobs","iOS","Updates","Post-PC","CSS3","Web-sockets","Facebook"]}];
var comforter =[[],[]];
            

            function showtags(array){
                for (var i=0;i<array.length;i++){

                    messages.push(R.wordbubble(array[i]["title"]));
                    comforter[i][0]=messages[i];
                    comforter[i][1] = R.wordswirl(array[i]["words"],comforter[i][0]);
                }
            }

 /*
 *
 *           VISUALS:
 *
 */
        Raphael.fn.wordbubble = function(input){
            var x=340;
            var y=600;
            var separation=300;
            if (messages.length>0){
                var prior_instance =messages[messages.length-1][1].getBBox(false);
                x=messages[messages.length-1][0].attr("x");
                y=prior_instance["y"]-prior_instance["height"]-separation;
                if (messages.length%10==0){
                    x+=100;
                    y=570;
                }
                
            }
            var text = this.text(x,y,input).attr({font: '14px Helvetica, Arial', fill: "white", cursor: "pointer", "font-weight": "bold", "fill":"rgb(254, 254, 254)"});
            var text_info = text.getBBox(false);
            var box = this.rect(x-text_info["width"]/2-6,y-text_info["height"]/2-4,text_info["width"]+12,text_info["height"]+9,5);
            var params = {fill: "rgb(26, 65, 48)", stroke: "rgb(33, 113, 87)", "fill-opacity": 1, "stroke-width": 2};
            text.toFront();
            box.attr(params);
            return this.set(
                    box,
                    text);
        };

        Raphael.fn.wordswirl = function(group, boss){
            var separation=5;
            var bossy = boss.getBBox(false);
            var x=bossy["x"]+bossy["width"]/2;
            var y=bossy["y"]+bossy["height"]/2;
            var pitch = 0;
            var xradius = 250;
            var yradius = 0.5*xradius;
            var currentpitch =-Math.PI/2;
            var swirl = [];
            var params = {fill: "rgb(26, 65, 48)", stroke: "rgb(33, 113, 87)","fill-opacity": 1, "stroke-width": 2};
           
            if (group.length>0){
                pitch = 2*Math.PI/group.length;
            }

            for (var i=0;i<group.length;i++){
                //instance:
                var text = this.text(x+xradius*Math.cos(currentpitch),y+yradius*Math.sin(currentpitch),group[i]).attr({font: '12px Helvetica, Arial', fill: "white", cursor: "pointer", "font-weight": "bold","fill":"rgb(230, 245, 230)"});
                var text_info = text.getBBox(false);
                var box = this.rect(x+xradius*Math.cos(currentpitch)-text_info["width"]/2-12,y+yradius*Math.sin(currentpitch)-text_info["height"]/2-4,text_info["width"]+24,text_info["height"]+9,5);
                text.toFront();
                box.attr(params);
                connections.push(this.connection(boss, box,"#000", "#fff|3"));
                swirl.push(this.set(text,box));
                currentpitch+=pitch;
                }
            boss.toFront();
            this.ellipse(x, y, xradius, xradius*(0.8)).attr({fill: "rhsb(0.7,0, 0)-hsb(0.172 , 1, .12)", stroke: "none", opacity: 0}).toBack();
            return swirl;
            };
        Raphael.fn.comfort = function (array){
            for (var h=0;h<array.length;h++){
            var change = false;
            for (var i=0;i<array[h][1].length-1;i++){
                var questionable = array[h][1][i].getBBox(false);
                for (var j=0;j<array[h][1].length && j!=i;j++){
                    var question = array[h][1][j].getBBox(false);
                    
                    if (Math.pow(Math.pow((questionable["x"]-questionable["width"]/2)-(question["x"]-question["width"]/2),2)+Math.pow((questionable["y"]+questionable["height"]/2)-(question["y"]+question["height"]/2),2),0.5)<100){
                        if (questionable["x"]<question["x"]){
                            array[h][1][j].transform("...t5,0");
                            change = true;
                        }
                        else {
                            array[h][1][j].transform("...t-5,0");
                            change = true;
                        }
                        if (questionable["y"]<question["y"]){
                            array[h][1][j].transform("...t0,5");
                            change = true;
                        }
                        else {
                            array[h][1][j].transform("...t0,-5");
                            change = true;
                        }
                        
                    }
                }
            }
            for (var i=0;i<array[h][1].length-1;i++){
                var questionable = array[h][1][i].getBBox(false);
                var question = array[h][0].getBBox(false);
                    
                    if (Math.pow(Math.pow((questionable["x"]-questionable["width"]/2)-(question["x"]-question["width"]/2),2)+Math.pow((questionable["y"]+questionable["height"]/2)-(question["y"]+question["height"]/2),2),0.5)>300){
                        if (questionable["x"]<question["x"]){
                            array[h][1][i].transform("...t-5,0");
                            change = true;
                        }
                        else {
                            array[h][1][i].transform("...t5,0");
                            change = true;
                        }
                        if (questionable["y"]<question["y"]){
                            array[h][1][i].transform("...t0,-5");
                            change = true;
                        }
                        else {
                            array[h][1][i].transform("...t0,5");
                            change = true;
                        }
                        
                    }
                    if (Math.pow(Math.pow((questionable["x"]-questionable["width"]/2)-(question["x"]-question["width"]/2),2)+Math.pow((questionable["y"]+questionable["height"]/2)-(question["y"]+question["height"]/2),2),0.5)<60){
                        if (questionable["x"]<question["x"]){
                            array[h][1][i].transform("...t5,0");
                            change = true;
                        }
                        else {
                            array[h][1][i].transform("...t-5,0");
                            change = true;
                        }
                        if (questionable["y"]<question["y"]){
                            array[h][1][i].transform("...t0,5");
                            change = true;
                        }
                        else {
                            array[h][1][i].transform("...t0,-5");
                            change = true;
                        }
                        
                    }
                }
            }
        
            if (change){
                for (var i =0; i<connections.length; i++) {
                    R.connection(connections[i]);
                }
            }
            return change;
        };

        Raphael.fn.ball = function (x, y, r, hue, initmass, initspeedx, initspedy) {
            hue = hue || 0;
            return {object:
                this.set(
                    this.ellipse(x, y + r - r / 5, r, r / 2).attr({fill: "rhsb(" + hue + ",.25, .25)-hsb(" + hue + ", 1, .25)", stroke: "none", opacity: 0}),
                    this.ellipse(x, y, r, r).attr({fill: "rgb(100,150,100)", stroke: "none", opacity: 1}), //"r(.5,.9)hsb(0.2, 1, .75)-hsb(0.35, .5, .25)"
                    this.ellipse(x, y, r - r / 5, r - r / 20).attr({stroke: "none", fill: "r(.5,.1)#ccc-#ccc", opacity: 0})
                ),
                mass : initmass,
                speedx: initspeedx,
                speedy : initspedy};
        };

        Raphael.fn.connection = function (obj1, obj2, line, bg) {
            if (obj1.line && obj1.from && obj1.to) {
                line = obj1;
                obj1 = line.from;
                obj2 = line.to;
            }
            var bb1 = obj1.getBBox(),
                bb2 = obj2.getBBox(),
                p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
                d = {}, dis = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 4; j < 8; j++) {
                    var dx = Math.abs(p[i].x - p[j].x),
                        dy = Math.abs(p[i].y - p[j].y);
                    if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                        dis.push(dx + dy);
                        d[dis[dis.length - 1]] = [i, j];
                    }
                }
            }
            if (dis.length == 0) {
                var res = [0, 4];
            } else {
                res = d[Math.min.apply(Math, dis)];
            }
            var x1 = p[res[0]].x,
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

        window.onload = function () {
            // var dragger = function () {
            //     this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
            //     this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
                
            // },
            //     move = function (dx, dy) {
            //         var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            //         this.attr(att);
            //         for (var i=0; i<connections.length; i++;) {
            //             R.connection(connections[i]);
            //         }
            //         R.safari();
            //     },
            //     up = function () {
            // };
            var dragger = function () {
                this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
                this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
                
            };
            var up = function () {};
            var move = function (dx, dy) {
                    var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
                    this.attr(att);
                    for (var i=0; i<connections.length; i++) {
                        R.connection(connections[i]);
                    }
                    R.safari();
                };
            R = Raphael("canvas"), connections =[];
            showtags(tags);
            console.log(comforter[0][0][0]);
            comforter[0][0][0].drag(move, dragger, up);
            // for (var i=0;i<comforter.length;i++){
            //     comforter[i][0].drag(move,dragger, up);
            // }
            

        };
        var R;
        var A;
        var B;
        var need = true;
        var dt = 20;
        // var pastfill = "rgb(157, 210, 47)";//"r(.5,.9)hsb(0.4, 1, .75)-hsb(0.45, .5, .25)"
        setInterval ( function () {
            need = R.comfort(comforter);

        }
            , dt );