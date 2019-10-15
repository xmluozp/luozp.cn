//***** Modified from codepen.io's shared code, author: Gregory Schier
import React, { useEffect, useRef, useState } from 'react';
import { Send } from '@material-ui/icons';
// import _ from 'lodash';

export default ({ className, waitingTime, textArray, isSendIcon ,callBack }) => {

  const simpleTyping = useRef(null);
  const [isEnd, setIsEnd] = useState(false);
  let txtRotate;

  const handleIsEnd = () => {
    setIsEnd(true);
    
    if(typeof(callBack) === 'function') callBack();
  }

  const iconCursor = isEnd? null: { borderRight: '0.08em solid #666' };

  useEffect(() => {

    txtRotate = new TxtRotate(simpleTyping.current, textArray, waitingTime, false, handleIsEnd);

    return () => {
      txtRotate.clearTimer();
     };
  }, [])
  return <>
      <span className={className} ref={simpleTyping} style={iconCursor}></span>{isEnd && isSendIcon? <span style={{color: 'rgb(173, 178, 179)', fontStyle: 'italic' ,fontSize: '.8rem', marginLeft: '8pt'}}>
           [sent
          <Send style={{color: 'rgb(173, 178, 179)', fontSize: '13pt', verticalAlign: 'middle', marginLeft: '2pt'}}/>]
        </span>
        : null}
    </>
}

class TxtRotate {

  constructor(el, textArray, period, isLoop, callBack) {

    this.textArray = textArray || [];
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = ''; // 存放最终输出的文字
    this.tick();
    this.isDeleting = false;
    this.isLoop = isLoop || false;
    this.isEnd = false;
    this.callBack = callBack;
    
  }

  clearTimer(){
    clearTimeout(this.timer);
  }
  calculateRemain(txtOld, txtNew) {
    let returnValue = '';
    for (let index = 0; index < txtOld.length && txtOld[index] === txtNew[index]; index++) {
      returnValue += txtOld[index];
    }
    return returnValue.length;
  }

  tick() {

    var i = this.loopNum % this.textArray.length;
    var fullTxt = this.textArray[i];
    var that = this;
    var delta = 200 - Math.random() * 100;

    // 后面借此判断是否继续打字
    // const isTyping = this.isLoop || ;

    if (!this.isEnd) {

      const nextTxtLength = this.textArray[i + 1] ? this.calculateRemain(fullTxt, this.textArray[i + 1]) : ''; // 获取下一段文字需要保留的部分

      if (this.isDeleting) {
        delta /= 2; // 如果开始删除，时间加倍
        this.txt = fullTxt.substring(0, this.txt.length - 1); // 一次减少一个字符。其实fulltxt没有变
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1); // 一次加一个字符
      }

      // 切换点
      if (!this.isDeleting && (this.txt.length >= fullTxt.length)) {  // 这里打字打完了切换成删除
        this.isDeleting = true;
        delta = this.period;

        if(!this.isLoop && i >= this.textArray.length - 1) {
          this.isEnd = true;
        }
      } else if (this.isDeleting && (this.txt.length <= nextTxtLength)) { // 文字删光了，开始生成新的文字
        this.isDeleting = false;
        delta = 500;
        this.loopNum++;
      }

      // 如果不设成循环，loopNum到头就停止

      this.timer = setTimeout(function () {
        that.tick();
      }, delta);
    }
    else {
      this.callBack();
    }

    this.el.innerHTML = '<span class="wrap"> ' + this.txt + '</span>';
  }
}