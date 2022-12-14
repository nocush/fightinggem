const canvas = document.querySelector('canvas')
//c = context
const c = canvas.getContext('2d')
const gravity = 0.7

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/background.png'
})

const player = new Fighter({
    position:{
    x: 0,
    y: 0
},
    velocity:{
    x: 0,
    y: 0
},
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/Player1/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x:100,
        y:150
    },
    sprites: {
        idle: {
            imageSrc: './Assets/Player1/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './Assets/Player1/Sprites/Run.png',
            framesMax: 8,
            
        },
        jump: {
            imageSrc: './Assets/Player1/Sprites/Jump.png',
            framesMax: 2,

        },
        fall: {
            imageSrc: './Assets/Player1/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './Assets/Player1/Sprites/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './Assets/Player1/Sprites/Take Hit.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './Assets/Player1/Sprites/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 200,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const enemy = new Fighter({
    position:{
    x: 400,
    y: 100
},
    velocity:{
    x: 0,
    y: 0},

    imageSrc: './Assets/Player2/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x:215,
        y:165
    },
    sprites: {
        idle: {
            imageSrc: './Assets/Player2/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Assets/Player2/Sprites/Run.png',
            framesMax: 8,
            
        },
        jump: {
            imageSrc: './Assets/Player2/Sprites/Jump.png',
            framesMax: 2,

        },
        fall: {
            imageSrc: './Assets/Player2/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './Assets/Player2/Sprites/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './Assets/Player2/Sprites/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './Assets/Player2/Sprites/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -280,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false 
    },
    d: {
        pressed: false 
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}



decreaseTimer()
function animate(){
    animationId = window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    c.fillStyle = 'rgba(255, 255, 255,0.02)'
    c.fillRect(0,0,canvas.width, canvas.height)
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0
    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }
    //jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }else if (player.velocity.y >0){
        player.switchSprite('fall')
    }

    //enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }

     //jumping
     if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y >0){
        enemy.switchSprite('fall')
    }

    //detect for collision & enemy gets hit
    if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4){
            enemy.takeHit()
            player.isAttacking = false

            gsap.to('#enemyHealth', {
                width: enemy.health + "%"
            })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }
    // this is where our player gets hit
    if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + "%"
        })
    }

    //if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    //end game based on health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead && tie !== true){
    switch(event.key){
        case 'd':
         keys.d.pressed = true
         player.lastKey = 'd'
         break
        case 'a':
         keys.a.pressed = true
         player.lastKey = 'a'
         break
        case ' ':
         player.attack()   
         break  
    }
    if(player.velocity.y === 0)
    switch(event.key){
        case 'w':
         player.velocity.y = -20
         break
    }
    }
    if (!enemy.dead && tie !== true){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowDown':
            enemy.attack()  
            break 
    }
    if(enemy.velocity.y === 0)
    switch(event.key){
        case 'ArrowUp':
         enemy.velocity.y = -20
         break
    }
    }
})

window.addEventListener('keyup', (event) => {
    //player keys
    switch(event.key){
        case 'd':
         keys.d.pressed = false
         break
        case 'a':
         keys.a.pressed = false
         break
    }

    //enemy keys
    switch(event.key){
        case 'ArrowRight':
         keys.ArrowRight.pressed = false
         break
        case 'ArrowLeft':
         keys.ArrowLeft.pressed = false
         break
    }
})