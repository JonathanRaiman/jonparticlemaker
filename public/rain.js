

        Raphael.fn.ball = function (x, y, r, hue) {
            hue = hue || 0;
            return this.set(
                this.ellipse(x, y + r - r / 5, r, r / 2).attr({fill: "rhsb(" + hue + ",.25, .25)-hsb(" + hue + ", 1, .25)", stroke: "none", opacity: 0}),
                this.ellipse(x, y, r, r).attr({fill: "rgb(100,150,100)", stroke: "none", opacity: 1}), //"r(.5,.9)hsb(0.2, 1, .75)-hsb(0.35, .5, .25)"
                this.ellipse(x, y, r - r / 5, r - r / 20).attr({stroke: "none", fill: "r(.5,.1)#ccc-#ccc", opacity: 0})
            );
        };

        window.onload = function () {
            var R = Raphael("canvas"), x = 310, y = 250, r = 20;
            A= R.ball(x-40, y, r, Math.random()).data("mass",10).data("dx",0).data("dy",0);
            B= R.ball(x+40, y, r, Math.random()).data("mass",400);
            R.customAttributes.mass = function (num) {
            return num;
            }
        };
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
            A.attr({cx:A[1].attr("cx")+A[1].data("dx"), cy:A[1].attr("cy")+A[1].data("dy")});
            var alpha = pull(A,B);
            A[1].data("dx", gravity_drag*A[1].data("dx")+alpha[0]);
            A[1].data("dy", gravity_drag*A[1].data("dy")+alpha[1]);
            // if (Math.abs(A[1].data("dx"))<0.01){
            //     A[1].data("dx",0);
            // }
            // if (Math.abs(A[1].data("dy"))<0.01){
            //     A[1].data("dy",0);
            // }
            

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
    var delta_x=bodyB[1].attr("cx")-bodyA[1].attr("cx");
    var delta_y=bodyB[1].attr("cy")-bodyA[1].attr("cy");
    var delta_xy_2 = Math.pow(delta_x,2)+Math.pow(delta_y,2);
    var force = G*bodyA[0].data("mass")*bodyB[0].data("mass")/delta_xy_2;
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
    if (A[1].attr("cx")<0){
        A.attr({cx:0});
        A[1].data("dx",-A[1].data("dx"));
    }
    if (A[1].attr("cx")>640){
        A.attr({cx:640});
        A[1].data("dx",-A[1].data("dx"));
    }
    if (A[1].attr("cy")<0){
        A.attr({cy:0});
        A[1].data("dy",-A[1].data("dy"));
    }
    if (A[1].attr("cy")>800-A[1].attr("r")){
         A.attr({cy:800});
         A[1].data("dy",-A[1].data("dy"));
    }
    var forcex = force*cos_mult*Math.abs(delta_y)/Math.pow(delta_xy_2,0.5);
    var forcey = force*sin_mult*Math.abs(delta_x)/Math.pow(delta_xy_2,0.5);

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
                
                if(e.which == 32 || e.which == 38)
                {
                event.preventDefault();
                A[1].data("dy", A[1].data("dy")-2);
                }
            });

            $(document).keydown(function(e)
            {
                
                if(e.which == 37)
                {
                event.preventDefault();
                A[1].data("dx", A[1].data("dx")-2);
                
                }
            });

            $(document).keydown(function(e)
            {
                
                if(e.which == 40)
                {
                event.preventDefault();
                A[1].data("dy", A[1].data("dy")+2);
                }
            });

            $(document).keydown(function(e)
            {
                
                if(e.which == 39)
                {
                event.preventDefault();
                A[1].data("dx", A[1].data("dx")+2);
                }
         });
    });