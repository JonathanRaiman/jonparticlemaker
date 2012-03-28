
        Raphael.fn.ball = function (x, y, r, hue) {
            hue = hue || 0;
            return this.set(
                this.ellipse(x, y + r - r / 5, r, r / 2).attr({fill: "rhsb(" + hue + ",.25, .25)-hsb(" + hue + ", 1, .25)", stroke: "none", opacity: 0}),
                this.ellipse(x, y, r, r).attr({fill: "rgb(100,150,100)", stroke: "none", opacity: 1}), //"r(.5,.9)hsb(0.2, 1, .75)-hsb(0.35, .5, .25)"
                this.ellipse(x, y, r - r / 5, r - r / 20).attr({stroke: "none", fill: "r(.5,.1)#ccc-#ccc", opacity: 0})
            );
        };
        window.onload = function () {
            var R = Raphael("canvas"), x = 310, y = 250, r = 200;
            A= R.ball(x, y, r, Math.random());
        };
        var A;
        var xhover = 0;
        var yhover = 0;
        var hue = Math.random();
        // var pastfill = "rgb(157, 210, 47)";//"r(.5,.9)hsb(0.4, 1, .75)-hsb(0.45, .5, .25)"
        setInterval ( function () {
            var temp = A[1].attr("fill");
            hue = hue+0.001;
            var a = (-1)^(Math.floor(Math.random()));
            xhover = xhover+0.01*a*Math.random();
            yhover = yhover+0.01*a*Math.random();
            
            if (hue>10){
                hue=hue-10;
            }

            A[1].animate({fill: "r(.5,.9)hsb("+hue+",.5,0.25)-hsb("+hue+0.05+",.5,.25)"});
            A[0].animate({fill: "rhsb("+hue+",.25,.25)-hsb("+hue+",1,.25)"});
            A.transform("t"+xhover+","+yhover);
        }
            , 10 );