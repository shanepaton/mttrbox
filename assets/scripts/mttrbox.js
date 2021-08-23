function initGame(){
    console.log("%c▶ mttrbox.js 1.0.0", "color:#DA5371");
    document.getElementById("toBeHidden").innerHTML = "";
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        canvas: document.querySelector('#canvas'),
        options: {
            wireframes: false,
            width: 1280,
            height: 720
        }
    });

    var keys = [];
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;

        if(e.keyCode == 74){
            if (!render.options.wireframes){
                render.options.wireframes = true;
                render.options.showAngleIndicator = true
            } else if(render.options.wireframes){
                render.options.wireframes = false;
                render.options.showAngleIndicator = false
            }
        }
    });    

    // create two boxes and a ground
    var gB = Bodies.rectangle(640, 720 - 17, 1278, 30, { isStatic: true, chamfer: { radius: 15 }, render: { fillStyle: '#F7F7F7' } });
    var gL = Bodies.rectangle(16, 720 / 2, 30, 716, { isStatic: true,  chamfer: { radius: 15 },render: { fillStyle: '#F7F7F7' } });
    var gR = Bodies.rectangle(1280 - 15,720 / 2, 30, 716, { isStatic: true, chamfer: { radius: 15 }, render: { fillStyle: '#F7F7F7' } });
    var gT = Bodies.rectangle(640, 0 + 17, 1278, 30, { isStatic: true, chamfer: { radius: 15 }, render: { fillStyle: '#F7F7F7' } });
    
    let placeState = 1;
    
    Matter.World.add(engine.world, [gB,gL,gR,gT]);
    var mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Composite.add(engine.world, mouseConstraint);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    function customRandomBodyColour(){
        randColourNum = Math.floor(Math.random() * 6)
        switch (randColourNum){
            case 0:
                return "#DA5371"
                break;
            case 1:
                return "#F55A3C"
                break;
            case 2:
                return "#6467F3"
                break;
            case 3:
                return "#F5D259"
                break;
            case 4:
                return "#A0F761"
                break;
            case 5:
                return "#238BCC"
                break;
        }
    }

    function createBox(x,y){
        var bTA = Bodies.rectangle(x, y, 50, 50, {render: { fillStyle: customRandomBodyColour(), }});
        Matter.World.add(engine.world, bTA);
    }
    function createCircle(x,y){
        var cTA = Bodies.circle(x, y, 25, {render: { fillStyle: customRandomBodyColour(), }});
        Matter.World.add(engine.world, cTA);
    }
    function createTriangle(x,y){
        var tTA = Bodies.polygon(x, y, 3, 30, {render: { fillStyle: customRandomBodyColour(), }});
        Matter.World.add(engine.world, tTA);
    }
    function createPentagon(x,y){
        var pTA = Bodies.polygon(x, y, 5, 30, {render: { fillStyle: customRandomBodyColour(), }});
        Matter.World.add(engine.world, pTA);
    }
    function createExplosion(x,y, explosionRad){
        explosionVar = 1
        var eTA = Bodies.circle(x, y, 150, {isStatic: true,render: { fillStyle: "#14151F", }});
        Matter.World.add(engine.world, eTA);
        Matter.World.remove(engine.world, eTA);
    }

    Matter.Events.on(mouseConstraint, 'mousedown', function(event) {
        
        var mousePosition = event.mouse.position;
        if(mouseConstraint.mouse.button == 2){    
            if(placeState == 1){
                createBox(mousePosition.x, mousePosition.y)
            } else if(placeState == 2){
                createCircle(mousePosition.x, mousePosition.y)
            } else if(placeState == 3){
                createTriangle(mousePosition.x, mousePosition.y)
            } else if(placeState == 4){
                createPentagon(mousePosition.x, mousePosition.y)
            }  else if(placeState == 5){
                createExplosion(mousePosition.x, mousePosition.y, 100)
            }
        }
    });

    
    Matter.Events.on(engine, "beforeUpdate", function(event) {
        
        if(keys[48] == true){
            placeState = 0
        }
        if(keys[49] == true){
            placeState = 1
        }
        if(keys[50] == true){
            placeState = 2
        }
        if(keys[51] == true){
            placeState = 3
        }
        if(keys[52] == true){
            placeState = 4
        }
        if(keys[53] == true){
            placeState = 5
        }
        if(keys[67] == true){
            document.getElementById('controlsBox').style.visibility = 'visible'; document.getElementById('canvas').style.pointerEvents = 'none'
        }
    });

        // run the engine
        Runner.run(runner, engine);
}