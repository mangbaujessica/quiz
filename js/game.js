let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let starImage = [];
let repA;
let answerImage = [];
let answerText = [];
let questionJSON;
let playBtn;
let questionText;
let questionIndex = 0;
let scoreText;
let score = 0;
let questionImg;
let goodSound;
let wrongSound;
let quiz1;
let menu;
let textAccueil;
let winGame;
let answerImageTweenGood = [];
let answerImageTweenBad = [];

function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('question', './assets/Sprites/label1.png');
    this.load.image('reponse', './assets/Sprites/label4.png');
    this.load.image('starImage', './assets/Sprites/Star.png');
    this.load.json('question', './assets/data/Questions.json');
    this.load.image('play', './assets/Sprites/play.png');
    this.load.audio('goodSound', './assets/Sound/good.wav');
    this.load.audio('wrongSound', './assets/Sound/wrong.wav');
    this.load.image('quiz1', './assets/Sprites/Quiz1.png');
    this.load.image('menu', './assets/Sprites/Menu.png');
    this.load.audio('winGame', './assets/Sound/winGame.wav');
    this.load.image('soundBtn', './assets/Sprites/block.png');



}

function create() {
    questionJSON = this.cache.json.get('question');
    goodSound = this.sound.add('goodSound');
    goodSound.setVolume(0);
    wrongSound = this.sound.add('wrongSound');
    wrongSound.setVolume(0);
    winGame = this.sound.add('winGame');
    
    console.log(questionJSON);
    let backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);
    backImage.setScale(0.5);
    
    soundBtn = this.add.image(550, 500, 'soundBtn').setInteractive();
    soundBtn.on('pointerdown', toogleSound);
    soundBtn.setScale(0.2);
    soundBtn.alpha = 0.4;
    
    quiz1 = this.add.image(300, 100, 'quiz1');
    quiz1.setScale(0.7);

    menu = this.add.image(300, 250, 'menu').setInteractive();
    menu.on('pointerdown', reStart);
    menu.setScale(0.7);

    
    textAccueil = this.add.text(180, 400, "", {
        fontFamily: 'Arial',
        fontSize: 30,
        color: '#222200'
    
    });



    questionImg = this.add.image(300, 100, 'question');
    questionImg.setScale(0.5);
    questionImg.setVisible(false);

    questionText = this.add.text(140, 75, "", {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#ffff00'

    });
   
    
    scoreText = this.add.text(180, 400, "Commencez le jeu", {
        fontFamily: 'Arial',
        fontSize: 30,
        color: '#222200'
    
    });

    for (let i = 0; i < questionJSON.questions[0].answer.length; i++) {
        answerImage[i] = this.add.image(300, 200 + i * 100, 'reponse').setInteractive();
        answerImage[i].on('pointerdown', () => {
            checkAnswer(i)
        });
        answerImage[i].setVisible(false);    
        answerImageTweenGood[i]= this.tweens.add({
            targets: answerImage[i],
            scaleX: 1.3,
            scaleY: 1.2,
            duration: 300,
            ease: 'Power 2',
            yoyo: true,
            loop: 0, //-1 = infini
            paused: true      
        });
          answerImageTweenBad[i]= this.tweens.add({
            targets: answerImage[i],
            angle:15,
            ease: 'Lineaar',
            yoyo: true,
            repeat: 2, //-1 = infini
            paused: true      
        });
        
        answerText[i] = this.add.text(180, 185 + i * 100,"", {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#AA0044'
        });
    }



    playBtn = this.add.image(300, 500, 'play').setInteractive();
    playBtn.on('pointerdown', nextQuestion);
    playBtn.setScale(0.3);
    playBtn.setVisible(false);
    //playBtn.alpha = 0.9;/pour rendre invisible alpha a 0

    for (let i = 0; i < 10; i++) {
    starImage[i] = this.physics.add.image(30+i*60 , 600, 'starImage');
    starImage[i].setScale(0.3);
    starImage[i].alpha = 0;
        
        }
    
}



function update() {

}

function nextQuestion() {
    questionIndex++;
    playBtn.setVisible(false);
    
    if (questionIndex < questionJSON.questions.length) {
         questionText.text = questionJSON.questions[questionIndex].title;

    for (let i = 0; i < questionJSON.questions[questionIndex].answer.length; i++) {
        answerImage[i].setInteractive();
        answerText[i].setColor("#AA0044");
        answerText[i].text = questionJSON.questions[questionIndex].answer[i];
    }
        
    } 
    
    else {
        for (let i = 0; i < questionJSON.questions[0].answer.length; i++) {
            answerImage[i].setVisible(false);
            answerText[i].setVisible(false);
            questionText.setVisible(false);
            questionImg.setVisible(false);
           
    }
        scoreText.text= "Votre score est " + score + "/10" ;
        quiz1.setVisible(true);
        menu.setVisible(true);
        if (score==10) {
            for (let i = 0; i < 10; i++) {
            starImage[i].setVelocity(Phaser.Math.Between(-50,50), 
                                     Phaser.Math.Between(-300, -100));
                
        winGame.play();
        }
        }
        
    }
    
}

function checkAnswer(answerClicked) {
   

    for (let i = 0; i < questionJSON.questions[questionIndex].answer.length; i++) {
        playBtn.setVisible(true);
        answerImage[i].disableInteractive();

        if (i == questionJSON.questions[questionIndex].goodAnswer) answerText[i].setColor("#11BB22");
        else answerText[i].setColor("#AAAAAA")
    }

    if (answerClicked == questionJSON.questions[questionIndex].goodAnswer) {
        starImage[questionIndex].alpha = 1;
        score++;
        goodSound.play();
         answerImageTweenGood[answerClicked].play();
        }
    else {
        starImage[questionIndex].tint = 0xff0000;
    wrongSound.play();
         answerImageTweenBad[answerClicked].play();
    }
}

function reStart () {

    questionIndex = 0;
    score = 0;
        scoreText.text= "" ;
        quiz1.setVisible(false);
        menu.setVisible(false);
        
    for (let i = 0; i < 10; i++) {
    starImage[i].alpha = 0.4;
    starImage[i].tint = 0xffffff;
        starImage[i].setVelocity(0,0);
        starImage[i].setPosition(30 + i * 60,600);
       
        }   
    
    for (let i = 0; i < questionJSON.questions[questionIndex].answer.length; i++) {
        answerImage[i].setVisible(true);
        answerImage[i].setInteractive();
        answerText[i].setVisible(true);       
        answerText[i].setColor("#AA0044");
        answerText[i].text = questionJSON.questions[questionIndex].answer[i];
    }
    questionText.text = questionJSON.questions[questionIndex].title;
    questionImg.setVisible(true);    
    questionText.setVisible(true);
        
}



function toogleSound () {
    if (soundBtn.alpha == 0.4) {
        goodSound.setVolume(1);
        wrongSound.setVolume(1);
        soundBtn.alpha =1;
        
        } else {
        goodSound.setVolume(0);
        wrongSound.setVolume(0);
        soundBtn.alpha = 0.4;
            
        }
}

