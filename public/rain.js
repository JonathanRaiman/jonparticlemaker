/*
 *
 *           TEXT INPUT
 *
 */

var messages =[];
$('#inputform').live('submit', function() {
var input = $('#inputter').val();
$('#inputter').val('');
var boxie = R.wordbubble(input);
messages.push(boxie);
return false;
});
 /*
 *
 *           VISUALS:
 *
 */
        Raphael.fn.wordbubble = function(input){
            var x=300;
            var y=570;
            var separation=5;
            if (messages.length>0){
                var prior_instance =messages[messages.length-1][1].getBBox(false);
                x=messages[messages.length-1][0].attr("x");
                y=prior_instance["y"]-prior_instance["height"]-separation;
                if (messages.length%10==0){
                    x+=100;
                    y=570;
                }
                console.log(x);
            }
            var text = this.text(x,y,input).attr({font: '12px Helvetica, Arial', fill: "white", cursor: "pointer"});
            var text_info = text.getBBox(false);
            var box = this.rect(x-text_info["width"]/2-6,y-text_info["height"]/2-2,text_info["width"]+12,text_info["height"]+5,5);
            var params = {fill: "rgb(26, 65, 48)", stroke: "rgb(33, 113, 87)", "fill-opacity": 1, "stroke-width": 2};
            text.toFront();
            box.attr(params);
            return this.set(
                    text,
                    box);
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

        window.onload = function () {
            R = Raphael("canvas"), x = 310, y = 250, r = 20;
            A= R.ball(x-40, y, r, Math.random(), 10, 0, 0);
            B= R.ball(x+40, y, r, Math.random(), 400, 0, 0);
            C= R.ellipse(310,400, 25, 25).attr({fill: "rgb(26, 65, 48)", stroke: "rgb(33, 113, 87)", "fill-opacity": 1, "stroke-width": 2});
            console.log("BBox x equals :"+C.getBBox(false)["x"]);
            console.log("Cx equals :"+C.attr("cx"));
        };
        var R;
        var A;
        var B;
        var dt = 10;
        var gravity_drag =0.999;
        var hue = Math.random();
        // var pastfill = "rgb(157, 210, 47)";//"r(.5,.9)hsb(0.4, 1, .75)-hsb(0.45, .5, .25)"
        setInterval ( function () {
            // hue = hue+0.001;
            // var a = (-1)^(Math.floor(Math.random()));
            // xhover = xhover+0.01*a*Math.random();
            // yhover = yhover+0.01*a*Math.random();
            // A[1].animate({fill: "r(.5,.9)hsb("+hue+",.5,0.25)-hsb("+hue+0.05+",.5,.25)"});
            // A[0].animate({fill: "rhsb("+hue+",.25,.25)-hsb("+hue+",1,.25)"});
            
            var alpha = [0,0];//pull(A,B);
            A["object"].transform(A["object"].transform()+"t"+A["speedx"]+","+A["speedy"]);
            console.log(A["object"].transform());
            A["speedx"]= gravity_drag*A["speedx"]+alpha[0];
            A["speedy"]= gravity_drag*A["speedy"]+alpha[1];

            
            

        }
            , dt );


/*
 *
 *           Newton's law of universal gravitation
 *
 */

var G=6.674*0.0005;

function pull (bodyA, bodyB) {
    // B pulls A towards it with the following force F=G*m1*m2/r^2 
    var delta_x=bodyB["object"].getBBox(false)["x"]-bodyA["object"].getBBox(false)["x"];
    var delta_y=bodyB["object"].getBBox(false)["y"]-bodyA["object"].getBBox(false)["y"];
    var delta_xy_2 = Math.pow(delta_x,2)+Math.pow(delta_y,2);
    var force = G*500/delta_xy_2;
    var cos_mult=1;
    var sin_mult=1;
    // if (Math.pow(delta_xy_2,0.5)<1*A[1].attr("r")){
    //     return ;
    // }
    if (delta_x<0){
        cos_mult=-1;
    }
    if (delta_y<0){
        sin_mult=-1;
    }
    if (A["object"].attr("cx")<0){
        A["object"]({cx:0});
        A["speedx"]=-A["speedx"];
    }
    if (A["object"].attr("cx")>640){
        A["object"].attr({cx:640});
        A["speedx"]=-A["speedx"];
    }
    if (A["object"].attr("cy")<0){
        A["object"].attr({cy:0});
        A["speedy"]=-A["speedy"];
    }
    if (A["object"].attr("cy")>800-A["object"].getBBox(false)["width"]){
         A["object"].attr({cy:800});
         A["speedy"]=-A["speedy"];
    }
    var forcex = force*cos_mult*Math.abs(delta_y)/delta_xy_2;
    var forcey = force*sin_mult*Math.abs(delta_x)/delta_xy_2;

    return [forcex, forcey];

}


/*
 *
 *           KEYBOARD INPUT
 *
 */

    $(document).ready(function()
        {
         
            $(document).keydown(function(e)
            {
                
                if(e.which == 38)
                {
                event.preventDefault();
                A["speedy"]-=2;
                }
            });

            $(document).keydown(function(e)
            {
                
                if(e.which == 37)
                {
                event.preventDefault();
                A["speedx"]-=2;
                
                }
            });

            $(document).keydown(function(e)
            {
                
                if(e.which == 40)
                {
                event.preventDefault();
                A["speedy"]+=2;
                }
            });

            $(document).keydown(function(e)
            {
                
                if(e.which == 39)
                {
                event.preventDefault();
                A["speedx"]+=2;
                }
         });
    });