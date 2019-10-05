let loadingRender = function () {
    let imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];
    let $curLoading = $('.curLoading'),
        n = 0, len = imgData.length, timer;

    function overTime(callback) {
        timer = setTimeout(() => {
            n / len > 0.9 ? (callback && callback()) :
                (alert('很遗憾，网络状况不佳..'), window.location = 'https://www.baidu.com');
        }, 60000);
    }

    function run(callback) {
        imgData.forEach(item => {
            let imgTemp = new Image();
            imgTemp.onload = function () {
                imgTemp = null;
                $curLoading.css('width', ++n / len * 100 + '%');
                if (n === len) {
                    setTimeout(() => {
                        clearInterval(timer);
                        callback && callback();
                    }, 2000);

                }
            };
            imgTemp.src = item;
        });
    }

    function down() {
        $('.loadingBox').fadeOut();
        answerRender.init();
    }

    return {
        init: function () {
            $('.loadingBox').css('display', 'block');
            overTime(down);
            run(down);
        }
    }
}();
let answerRender = function () {

    let $answerBox = $('.answerBox'),
        $time = $answerBox.find('span'),
        $answer = $answerBox.find('.answer'),
        $answerMark = $answer.find('.mark'),
        $hang = $answerBox.find('.hang'),
        $hangMark = $hang.find('.mark'),
        bell = $answerBox.find('#bell')[0],
        say = $answerBox.find('#say')[0],
        timer, duration;

    let answerTap = function () {
        bell.pause();
        say.play();
        $answer.css('display', 'none');
        $hang.css('transform', 'translateY(0)');
        $time.css('display', 'block');
        showTime();
    };
    let showTime = function (callback) {
        let minute = 0, second = 0, i = 0;
        timer = setInterval(() => {
            i++;
            i >= duration ? (done && done()) : null;
            minute = Math.floor(i / 60);
            second = i - minute * 60;
            $time.html(`${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`);
        }, 1000);
    };
    let done = function () {
        say.pause();
        clearInterval(timer);
        $answerBox.fadeOut();
        chatRender.init();
    };
    return {
        init: function () {
            $answerBox.css('display', 'block');
            bell.play();
            bell.volume = 0.3;
            say.oncanplay = function () {
                duration = say.duration;
            };

            $answerMark.tap(answerTap);
            $hangMark.tap(done);

        }
    }
}();
let chatRender = function () {
    let $chatBox = $('.chatBox'),
        $wrapper = $chatBox.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyBoard = $chatBox.find('.keyBoard'),
        $textInput = $keyBoard.find('span'),
        $submite = $keyBoard.find('.send'),
        music = $chatBox[0].getElementsByTagName('audio')[0];
    //自动播放
    let showTimer = null, interval = 1000, i = -1, len = $messageList.length, isSend = false, ty = 0;
    let showMessageAuto = function () {
        if (i === len) {
            clearInterval(showTimer);
            music.pause();
            $chatBox.fadeOut();
            cubeRender.init();
            return;
        }
        ++i;
        if (i === 2) {
            clearInterval(showTimer);
            showKeyboard();
            return;
        }

        if (i >= 4) {
            ty -= $messageList.get(i).offsetHeight + 20;
            $wrapper.css('transform', `translateY(${ty}px)`);
        }
        if (i === 3 && !isSend) {
            isSend = true;
            $messageList.eq(--i).addClass('active');
            return;
        }

        $messageList.eq(i).addClass('active');
    };

    //键盘弹出
    let textTimer = null, html;
    let showKeyboard = function () {
        $keyBoard.css('transform', 'translateY(0)').one('transitionend', () => {
            let str = '好的，马上介绍。', i = -1;
            /*let $newLi=$(`<li class="student">
                <i class="arrow"></i>
                <img src="img/zf_messageStudent.png" alt="" class="pic">
              </li>`);
            $wrapper[0].insertBefore($newLi[0],$messageList.get(2));*/
            textTimer = setInterval(() => {
                if (i === str.length - 1) {
                    clearInterval(textTimer);
                    $submite.css('display', 'block');
                    return;
                }
                html = $textInput.html();
                $textInput.html(html + str[++i]);
            }, 200);
        });
    };

    //发送
    let sendText = function () {
        let $newLi = $(`<li class="student">
                <i class="arrow"></i>
                <img src="img/zf_messageStudent.png" alt="" class="pic">
                ${$textInput.html()}
              </li>`);
        $wrapper[0].insertBefore($newLi[0], $messageList.get(2));
        $messageList = $wrapper.find('li');
        showTimer = setInterval(showMessageAuto, interval);
        $keyBoard.css('transform', 'translateY(3.7rem)');
        $textInput.html('');
    };

    return {
        init: function () {
            $chatBox.css('display', 'block');
            music.play();
            showMessageAuto();
            showTimer = setInterval(showMessageAuto, interval);
            $submite.tap(sendText);
        }
    }
}();
let cubeRender = (function () {
    let $cubeBox = $('.cubeBox'),
        $cube = $cubeBox.find('.cube'),
        $liList = $cube.find('li');

    let start = function (e) {
        let point = e.changedTouches[0];
        this.startX = point.clientX;
        this.startY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;
    };
    let move = function (e) {
        let point = e.changedTouches[0];
        this.changeX = (point.clientX - this.startX) * 0.5;
        this.changeY = (point.clientY - this.startY) * 0.5;

        let {changeX, changeY, rotateX, rotateY} = this;
        this.rotateX = rotateX = Math.floor(rotateX - changeY);
        this.rotateY = rotateY = Math.floor(rotateY + changeX);
        $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        this.startX = point.clientX;
        this.startY = point.clientY;
    };
    let end = function (e) {
        /*let {changeX, changeY,rotateX,rotateY} = this;

        if(Math.abs(changeX) > 10 || Math.abs(changeY) > 10){
            this.rotateX=rotateX=Math.floor(rotateX-changeY);
            this.rotateY=rotateY=Math.floor(rotateY+changeX);
            console.log(rotateX, rotateY);
            $(this).css('transform',`scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }*/
    };
    return {
        init: function () {
            $cubeBox.css('display', 'block');
            let cube = $cube[0];
            cube.rotateX = -35;
            cube.rotateY = 35;
            $cube.on('touchstart', start)
                .on('touchmove', move)
                .on('touchend', end);
            $liList.tap(function(){
                /*console.log($(this).index() + 1);*/
                $cubeBox.fadeOut();
                detailRender.init($(this).index());
            });
        }
    }
})();

let detailRender = (function () {
    let $detailBox = $('.detailBox'),
        $dl = $('.page1>dl'),
        swiper = null;

    let swiperInit = function (index) {
        swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            initialSlide:index,
            onInit: changed,
            onTransitionEnd: changed
        });
    };
    let changed = function (swiper) {
        let aIndex=swiper.activeIndex,
            swiperAry=swiper.slides;
        swiperAry.forEach(function (item,index) {

            if($(item).index()===aIndex){
                console.log($(item).index());
                item.id=`page${index+1}`;
                return;
            }
            item.id=null;
        });
        if (aIndex === 0) {

            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.2
            });
            $dl.makisu('open');
        }else{
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0
            });
            $dl.makisu('close');
        }


    };
    return {
        init: function (index=0) {
            $detailBox.css('display', 'block');
            swiperInit(index);
        }
    }
})();


let url = window.location.href,
    index = url.indexOf('#'),
    hash = index === -1 ? null : url.slice(index + 1);
switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'answer':
        answerRender.init();
        break;
    case 'chat':
        chatRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    case 'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();
        break;
}
