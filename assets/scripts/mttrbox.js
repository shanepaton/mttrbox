function initGame(){
    document.getElementById("toBeHidden").innerHTML = "";
    
    var keys = [];
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });
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

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 50, 50);
    var boxB = Bodies.rectangle(450, 50, 50, 50);
    var gB = Bodies.rectangle(640, 720 - 17, 1278, 30, { isStatic: true, render: { fillStyle: '#F7F7F7' } });
    var gL = Bodies.rectangle(16, 720 / 2, 30, 716, { isStatic: true, render: { fillStyle: '#F7F7F7' } });
    var gR = Bodies.rectangle(1280 - 15,720 / 2, 30, 716, { isStatic: true, render: { fillStyle: '#F7F7F7' } });
    var gT = Bodies.rectangle(640, 0 + 17, 1278, 30, { isStatic: true, render: { fillStyle: '#F7F7F7' } });
    
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


    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    function createBox(x,y){
        var bTA = Bodies.rectangle(x, y, 50, 50);
        Matter.World.add(engine.world, bTA);
    }
    function createCircle(x,y){
        var cTA = Bodies.circle(x, y, 25);
        Matter.World.add(engine.world, cTA);
    }

    Matter.Events.on(mouseConstraint, 'mousedown', function(event) {
        var mousePosition = event.mouse.position;
        if(mouseConstraint.mouse.button == 2){
            console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);
            
            if(placeState == 1){
                createBox(mousePosition.x, mousePosition.y)
            } else if(placeState == 2){
                createCircle(mousePosition.x, mousePosition.y)
            }
        }
    });

    
    Matter.Events.on(engine, "beforeUpdate", function(event) {
        if(keys[48] == true){
            console.log('none')
            placeState = 0
        }
        if(keys[49] == true){
            console.log('cube')
            placeState = 1
        }
        if(keys[50] == true){
            console.log('sphere')
            placeState = 2
        }
        if(keys[51] == true){
            console.log('triangle')
            placeState = 3
        }
        if(keys[67] == true){
            document.getElementById('controlsBox').style.visibility = 'visible'; document.getElementById('canvas').style.pointerEvents = 'none'
        }
        if(keys[53] == true){
            console.log('Clear world')
            Composite.bodies.forEach((body)=>{Matter.Composite.remove(engine.world, body)})
        }
    });

        // run the engine
        Runner.run(runner, engine);
}