document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let startPoint = 250
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = startPoint
    const doodlerWidth = 50
    const platformHeight = 15
    const platformWidth = 80
    const platformCount = 5
    const gridHeight = 600
    const gridWidht = 400
    const platforms = []
    let isGameOver = false
    let isJumping = false
    let upTimeId
    let downTimeId
    let isGoingLeft = false
    let isGoingRight = false
    let goLeft
    let goRight
    let score = 0

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }


    class Platform {
        constructor(newPlatform) {
            this.bottom = newPlatform
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)

        }
    }

    function createPlatfrom() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = gridHeight / platformCount
            let newPlatformBottom = 100 + platGap * i//new platformBottom plus 100 px
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
        }
    }


    function movePlatform() {
        if (doodlerBottomSpace > 200) {// if doodler move straigth then move platform to bottom
            platforms.forEach(p => {
                p.bottom -= 4 // move platform to bottom
                let visual = p.visual
                visual.style.bottom = p.bottom + 'px'

                if (p.bottom < 10) { // if platformBottomSpace less then 10 px then remove it
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift() // remove first element 

                    score++
                    //create new platform
                    let newPlatform = new Platform(gridHeight)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        isJumping = true
        clearInterval(downTimeId)
        upTimeId = setInterval(() => {
            doodlerBottomSpace += 20// doodler jump to 20 px in 30 milisecond
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {// if doodler jump from start point to 200 px then
                fall()
                isJumping = false
            }
        }, 30)
    }

    function fall() {
        isJumping = false
        clearInterval(upTimeId)
        downTimeId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace < 1) {
                gameOver()
            }

            platforms.forEach(p => {
                if (!isJumping &&
                    (doodlerBottomSpace >= p.bottom) &&
                    (doodlerBottomSpace <= p.bottom + platformHeight) &&
                    (doodlerLeftSpace + doodlerWidth >= p.left) &&
                    (doodlerLeftSpace <= p.left + platformWidth)) {

                    startPoint = doodlerBottomSpace
                    jump()
                }
            })

        }, 30)
    }

    function control(e) {
        if (e.key === 'ArrowLeft') {
            //move left
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            //move right
            moveRight()
        } else if (e.key === 'ArrowUp') {
            //jump
            moveStraight()
        }
    }

    function moveLeft() {
        isGoingLeft = true
        clearInterval(goRight)
        goLeft = setInterval(() => {
            if (doodlerLeftSpace + doodlerWidth >= doodlerWidth) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()

        }, 30)
    }

    function moveRight() {
        isGoingRight = true
        clearInterval(goLeft)
        goRight = setInterval(() => {
            if (doodlerLeftSpace + doodlerWidth <= gridWidht) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px'
                // if (doodlerLeftSpace + doodlerWidth == gridWidht) {
                //     moveLeft()
                // }
            } else moveLeft()

        }, 30)
    }

    function moveStraight() {
        clearInterval(goLeft)
        clearInterval(goRight)
    }




    function startGame() {
        if (!isGameOver) {
            createPlatfrom()
            createDoodler()
            setInterval(movePlatform, 35);
            jump()
            document.addEventListener('keyup', control)
        }
    }

    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        clearInterval(upTimeId)
        clearInterval(downTimeId)
        clearInterval(goRight)
        clearInterval(goLeft)
        grid.innerHTML = score
        console.log('Game over')

    }


    startGame()



})