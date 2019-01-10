$(function() {
   checkElement();
});

let elementsArray = [
   "page1TopDivTitle",
   "page1TopDivButtonDiv",
   "page1BottomDivTitle",
   "page1BottomDivSubtitle",
   "page1BottomAccordionTitle",
   "page1BottomAccordionDetails",
   "page1BottomAccordionDetailsExample",
   "page1BottomCardTitle",
   "page1BottomCardDetails",
   "page1BottomCardDetailsExample"
];

let isAccordion = !1;
// To track card current slide
let cardCurrent;

function checkElement() {
   for (i = 0; i < elementsArray.length; i++) {
      let element = document.getElementById(elementsArray[i]);
      if ($(element).css("opacity") == 1) {
         continue;
      }
      if (window.pageYOffset >= ($(element).position().top - $(window).height() * 0.8)) {
         animateElement(element);
      }
   }
}

function animateElement(theElement) {
   theElement.style.position = "relative";
   theElement.style.top = "-50px";
   $(theElement).animate({
      opacity: 1,
      top: "0"
   }, 1500);
}

function animatePage1Out() {
   // Show page2
   let page2 = $("#page2");
   page2.css("display", "flex");
   page2.css("position", "absolute");
   page2.css("top", "0");
   page2.css("left", "0");

   // Hide page1
   let page1 = $("#page1");
   page1.hide("fold", 1200, function() {
      page1.css("display", "none");

      page2.css("position", "");
      page2.css("top", "");
      page2.css("left", "");

      // Set opacity to 0 Again
      for (i = 0; i < elementsArray.length; i++) {
         let element = document.getElementById(elementsArray[i]);
         if ($(element).css("opacity") == 0) {
            continue;
         }
         element.style.opacity = "0";
      }
   });
}

function animatePage1In() {
   let page2 = $("#page2");
   page2.css("position", "absolute");
   page2.css("top", "0");
   page2.css("left", "0");

   let page1 = $("#page1");
   page1.show("fold", 1200, function() {
      page2.css("display", "none");
      page2.css("position", "");
      page2.css("top", "");
      page2.css("left", "");
      checkElement();
   });
}

function animatePage2Out() {
   // Show page3
   let page3 = $("#page3");
   page3.css("display", "flex");
   page3.css("position", "absolute");
   page3.css("top", "0");
   page3.css("left", "0");

   // Hide page2
   let page2 = $("#page2");
   page2.hide("drop", {
      direction: "down"
   }, 1200, function() {
      page2.css("display", "none");

      page3.css("position", "");
      page3.css("top", "");
      page3.css("left", "");
   });
}

function animatePage2In() {
   // Show page3
   let page3 = $("#page3");
   page3.css("position", "absolute");
   page3.css("top", "0");
   page3.css("left", "0");

   // Hide page2
   let page2 = $("#page2");
   page2.show("drop", {
      direction: "down"
   }, 1200, function() {
      page3.css("display", "none");
      page3.css("position", "");
      page3.css("top", "");
      page3.css("left", "");
   });
}

function animatePage3Out() {
   let page3 = $("#page3");
   page3.css("position", "absolute");
   page3.css("top", "0");
   page3.css("left", "0");

   let page1 = $("#page1");
   page1.show("fold", 1200, function() {
      page3.css("display", "none");
      page3.css("position", "");
      page3.css("top", "");
      page3.css("left", "");
      checkElement();
   });
}

function loadAccordionPreset() {
   isAccordion = !0;
   let componentsDiv = document.getElementById("componentsDiv");
   let accordionDiv = addNewAccordion();
   $(componentsDiv).empty();
   componentsDiv.appendChild(accordionDiv);
   animatePage1Out();
}

function addNewAccordion() {
   let accordionDiv = document.createElement("div");
   accordionDiv.className = "accordion";
   let accordionTitle = document.createElement("p");
   accordionTitle.contentEditable = "true";
   accordionTitle.appendChild(document.createTextNode("Enter Title Here"));
   // Double click for editing... remember to change on output
   accordionTitle.setAttribute("ondblclick",
      "this.nextElementSibling.className='accordionContent contenteditableBr'===this.nextElementSibling.className?'accordionContent contenteditableBr expand':'accordionContent contenteditableBr';"
   );
   contentEditableBr(accordionTitle);

   let accordionContent = document.createElement("div");
   // Contenteditable for editing... remember to change on output
   accordionContent.className = "accordionContent contenteditableBr";
   accordionContent.contentEditable = "true";
   accordionContent.innerHTML = "<p><br></p>";

   contentEditableBr();

   accordionDiv.appendChild(accordionTitle);
   accordionDiv.appendChild(accordionContent);

   return accordionDiv;
}

function loadCardPreset() {
   isAccordion = !1;
   let cardAnimationDiv = document.createElement("div");
   cardAnimationDiv.className = "cardAnimationDiv";
   cardAnimationDiv.appendChild(addNewCard());
   let componentsDiv = document.getElementById("componentsDiv");
   $(componentsDiv).empty();
   componentsDiv.appendChild(cardAnimationDiv);
   // Code that also be needed to be added at output
   for(var oriPos,z=0;z!=document.getElementsByClassName("cardAnimationDiv").length;){for(var nodeArray=document.getElementsByClassName("cardAnimationDiv")[z].children,i=0,j=nodeArray.length-1;i!=nodeArray.length;)nodeArray[i].style.zIndex=j,1!=i&&0!=i&&(nodeArray[i].style.display="none"),i++,j--;z++};

   // Adding buttons for navigation
   let backBtn = document.createElement("button");
   backBtn.setAttribute("onclick", "goLeft(null)");
   backBtn.appendChild(document.createTextNode("View Previous Slide"));
   let forwardBtn = document.createElement("button");
   forwardBtn.setAttribute("onclick", "ifDblClicked(null)");
   forwardBtn.appendChild(document.createTextNode("View Next Slide"));

   componentsDiv.appendChild(backBtn);
   componentsDiv.appendChild(forwardBtn);

   animatePage1Out();
}

function addNewCard() {
   let cardAnimationDivTitle = document.createElement("p");
   cardAnimationDivTitle.className = "contenteditableBr";
   cardAnimationDivTitle.contentEditable = "true";
   cardAnimationDivTitle.appendChild(document.createTextNode("Type here"));
   let cardSwipeDiv = document.createElement("div");
   cardSwipeDiv.className = "cardSwipeDiv";
   cardSwipeDiv.setAttribute("ondblclick", "ifDblClicked(this)");
   let cardSwipeContent = document.createElement("div");
   cardSwipeContent.className = "cardSwipeContent contenteditableBr";
   cardSwipeContent.contentEditable = "true";
   cardSwipeContent.appendChild(document.createTextNode("Type here"));

   cardSwipeDiv.appendChild(cardAnimationDivTitle);
   cardSwipeDiv.appendChild(cardSwipeContent);

   contentEditableBr();

   cardCurrent = cardSwipeDiv;
   return cardSwipeDiv;
}

function addNewSection() {
   if (isAccordion) {
      document.getElementById("componentsDiv").appendChild(addNewAccordion());
   } else {
      let newCard = addNewCard();
      cardCurrent = newCard;
      document.getElementsByClassName("cardAnimationDiv")[0].appendChild(newCard);
   }
}

function page2Output() {
   if(isAccordion) {
      let componentsDiv = $("#componentsDiv");
      componentsDiv.find(".accordion").each(function() {
         let accordion = $(this);
         let accordionTitle = accordion.children().eq(0)[0];
         let accordionContent = accordion.children().eq(1)[0];

         // Remove contentEditable
         accordionTitle.removeAttribute("contentEditable");
         accordionContent.removeAttribute("contentEditable");

         // Changing dblclick to click
         accordionTitle.removeAttribute("ondblclick");
         accordionTitle.setAttribute("onclick", "this.nextElementSibling.className='accordionContent'===this.nextElementSibling.className?'accordionContent expand':'accordionContent';");
      });

      $("#tempTextarea").html(componentsDiv.html());
   }

   animatePage2Out();
}

function checkEnterKey(e) {
   // trap the return key being pressed
   /*
   if (e.keyCode === 13) {
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
      document.execCommand("insertHTML", false, "<br><br>");
      // prevent the default behaviour of return key pressed
      return false;
   }
   */
   if (e.keyCode === 8) {
      if ($(this).html() === "<p><br></p>") {
         // prevent the default behaviour of return key pressed
         return false;
      }
   }
}

function contentEditableBr() {
   // Make sure there is only one event attached
   $(document).off("keydown", ".contenteditableBr", checkEnterKey);

   // Prevent creating div on enter
   $(document).on("keydown", ".contenteditableBr", checkEnterKey);
}

// Card functions
function getOriginalMousePosition(event) {
   oriPos=event.clientX;void 0==oriPos&&(oriPos=event.changedTouches[0].clientX);
}

function ifLeftOrRight(event, oriDiv) {
   var nowCursor=event.clientX;void 0==nowCursor&&(nowCursor=event.changedTouches[0].clientX);for(oriDiv=this;"cardSwipeDiv"!==oriDiv.className;)oriDiv=oriDiv.parentNode;nowCursor<oriPos-.16*oriDiv.clientWidth?goLeft(oriDiv):nowCursor>oriPos+.16*oriDiv.clientWidth&&ifDblClicked(oriDiv);
}

function goLeft(oriDiv) {
   for(!oriDiv&&cardCurrent&&(oriDiv=cardCurrent);"cardSwipeDiv"!==oriDiv.className;)oriDiv=oriDiv.parentNode;var prevDiv=oriDiv.previousElementSibling;
   if(prevDiv&&"cardSwipeDiv"===prevDiv.className){var frame=function(){1<=opa?clearInterval(id):(0>pos&&(pos+=2),opa+=.1,prevDiv.style.opacity=opa,prevDiv.style.marginLeft=pos+"px")},pos=parseInt(prevDiv.style.marginLeft.substring(0,prevDiv.style.marginLeft.length-2)),opa=0;prevDiv.style.display="flex";prevDiv.style.zIndex=1;var id=setInterval(frame,50);oriDiv.nextElementSibling&&(oriDiv.nextElementSibling.style.display="none")}cardCurrent=prevDiv;
}

function ifDblClicked(oriDiv) {
   for(!oriDiv&&cardCurrent&&(oriDiv=cardCurrent);"cardSwipeDiv"!==oriDiv.className;)oriDiv=oriDiv.parentNode;var nextDiv=oriDiv.nextElementSibling;if(nextDiv&&"cardSwipeDiv"===nextDiv.className){var frame=function(){0>=opa?(oriDiv.style.display="none",clearInterval(id)):(pos-=2,opa-=.1,oriDiv.style.opacity=opa,oriDiv.style.marginLeft=pos+"px")},nextNextDiv=oriDiv.nextElementSibling.nextElementSibling;nextNextDiv&&(nextNextDiv.style.display="flex");var pos=0,opa=1,id=setInterval(frame,50)}
   cardCurrent=nextDiv;
}

// Messy stuff
// CardStartup script
let cardStartup = "var _0x9aa7=['\x59\x32\x68\x70\x62\x47\x52\x79\x5a\x57\x34\x3d','\x63\x33\x52\x35\x62\x47\x55\x3d','\x5a\x32\x56\x30\x52\x57\x78\x6c\x62\x57\x56\x75\x64\x48\x4e\x43\x65\x55\x4e\x73\x59\x58\x4e\x7a\x54\x6d\x46\x74\x5a\x51\x3d\x3d','\x62\x47\x56\x75\x5a\x33\x52\x6f','\x59\x32\x46\x79\x5a\x45\x46\x75\x61\x57\x31\x68\x64\x47\x6c\x76\x62\x6b\x52\x70\x64\x67\x3d\x3d'];(function(_0x4d898b,_0x147fea){var _0x33b186=function(_0x227ac8){while(--_0x227ac8){_0x4d898b['\x70\x75\x73\x68'](_0x4d898b['\x73\x68\x69\x66\x74']());}};_0x33b186(++_0x147fea);}(_0x9aa7,0xed));var _0x79aa=function(_0x4d898b,_0x147fea){_0x4d898b=_0x4d898b-0x0;var _0x33b186=_0x9aa7[_0x4d898b];if(_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']===undefined){(function(){var _0x1e824e=Function('\x72\x65\x74\x75\x72\x6e\x20\x28\x66\x75\x6e\x63\x74\x69\x6f\x6e\x20\x28\x29\x20'+'\x7b\x7d\x2e\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72\x28\x22\x72\x65\x74\x75\x72\x6e\x20\x74\x68\x69\x73\x22\x29\x28\x29'+'\x29\x3b');var _0x257a42=_0x1e824e();var _0x3ff7f8='\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';_0x257a42['\x61\x74\x6f\x62']||(_0x257a42['\x61\x74\x6f\x62']=function(_0x4182dd){var _0x40855e=String(_0x4182dd)['\x72\x65\x70\x6c\x61\x63\x65'](/=+$/,'');for(var _0x3a7dbd=0x0,_0x2d8d7a,_0x561bd2,_0x31ba83=0x0,_0x4e1401='';_0x561bd2=_0x40855e['\x63\x68\x61\x72\x41\x74'](_0x31ba83++);~_0x561bd2&&(_0x2d8d7a=_0x3a7dbd%0x4?_0x2d8d7a*0x40+_0x561bd2:_0x561bd2,_0x3a7dbd++%0x4)?_0x4e1401+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&_0x2d8d7a>>(-0x2*_0x3a7dbd&0x6)):0x0){_0x561bd2=_0x3ff7f8['\x69\x6e\x64\x65\x78\x4f\x66'](_0x561bd2);}return _0x4e1401;});}());_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65']=function(_0x4e1233){var _0x2b837e=atob(_0x4e1233);var _0x12f500=[];for(var _0x437556=0x0,_0x3171c9=_0x2b837e['\x6c\x65\x6e\x67\x74\x68'];_0x437556<_0x3171c9;_0x437556++){_0x12f500+='\x25'+('\x30\x30'+_0x2b837e['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x437556)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(_0x12f500);};_0x79aa['\x64\x61\x74\x61']={};_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']=!![];}if(_0x79aa['\x64\x61\x74\x61'][_0x4d898b]===undefined){_0x33b186=_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65'](_0x33b186);_0x79aa['\x64\x61\x74\x61'][_0x4d898b]=_0x33b186;}else{_0x33b186=_0x79aa['\x64\x61\x74\x61'][_0x4d898b];}return _0x33b186;};for(var oriPos,z=0x0;z!=document[_0x79aa('0x0')]('\x63\x61\x72\x64\x41\x6e\x69\x6d\x61\x74\x69\x6f\x6e\x44\x69\x76')[_0x79aa('0x1')];){for(var nodeArray=document[_0x79aa('0x0')](_0x79aa('0x2'))[z][_0x79aa('0x3')],i=0x0,j=nodeArray[_0x79aa('0x1')]-0x1;i!=nodeArray[_0x79aa('0x1')];)nodeArray[i][_0x79aa('0x4')]['\x7a\x49\x6e\x64\x65\x78']=j,0x1!=i&&0x0!=i&&(nodeArray[i][_0x79aa('0x4')]['\x64\x69\x73\x70\x6c\x61\x79']='\x6e\x6f\x6e\x65'),i++,j--;z++;};";

// Mousedown / Touchstart
let cardMouseDown = "var _0x9aa7=['\x59\x32\x78\x70\x5a\x57\x35\x30\x57\x41\x3d\x3d'];(function(_0x4d898b,_0x147fea){var _0x33b186=function(_0x227ac8){while(--_0x227ac8){_0x4d898b['\x70\x75\x73\x68'](_0x4d898b['\x73\x68\x69\x66\x74']());}};_0x33b186(++_0x147fea);}(_0x9aa7,0xed));var _0x79aa=function(_0x4d898b,_0x147fea){_0x4d898b=_0x4d898b-0x0;var _0x33b186=_0x9aa7[_0x4d898b];if(_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']===undefined){(function(){var _0x1e824e=Function('\x72\x65\x74\x75\x72\x6e\x20\x28\x66\x75\x6e\x63\x74\x69\x6f\x6e\x20\x28\x29\x20'+'\x7b\x7d\x2e\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72\x28\x22\x72\x65\x74\x75\x72\x6e\x20\x74\x68\x69\x73\x22\x29\x28\x29'+'\x29\x3b');var _0x257a42=_0x1e824e();var _0x3ff7f8='\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';_0x257a42['\x61\x74\x6f\x62']||(_0x257a42['\x61\x74\x6f\x62']=function(_0x4182dd){var _0x40855e=String(_0x4182dd)['\x72\x65\x70\x6c\x61\x63\x65'](/=+$/,'');for(var _0x3a7dbd=0x0,_0x2d8d7a,_0x561bd2,_0x31ba83=0x0,_0x4e1401='';_0x561bd2=_0x40855e['\x63\x68\x61\x72\x41\x74'](_0x31ba83++);~_0x561bd2&&(_0x2d8d7a=_0x3a7dbd%0x4?_0x2d8d7a*0x40+_0x561bd2:_0x561bd2,_0x3a7dbd++%0x4)?_0x4e1401+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&_0x2d8d7a>>(-0x2*_0x3a7dbd&0x6)):0x0){_0x561bd2=_0x3ff7f8['\x69\x6e\x64\x65\x78\x4f\x66'](_0x561bd2);}return _0x4e1401;});}());_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65']=function(_0x4e1233){var _0x2b837e=atob(_0x4e1233);var _0x12f500=[];for(var _0x437556=0x0,_0x3171c9=_0x2b837e['\x6c\x65\x6e\x67\x74\x68'];_0x437556<_0x3171c9;_0x437556++){_0x12f500+='\x25'+('\x30\x30'+_0x2b837e['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x437556)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(_0x12f500);};_0x79aa['\x64\x61\x74\x61']={};_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']=!![];}if(_0x79aa['\x64\x61\x74\x61'][_0x4d898b]===undefined){_0x33b186=_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65'](_0x33b186);_0x79aa['\x64\x61\x74\x61'][_0x4d898b]=_0x33b186;}else{_0x33b186=_0x79aa['\x64\x61\x74\x61'][_0x4d898b];}return _0x33b186;};oriPos=event[_0x79aa('0x0')];void 0x0==oriPos&&(oriPos=event['\x63\x68\x61\x6e\x67\x65\x64\x54\x6f\x75\x63\x68\x65\x73'][0x0][_0x79aa('0x0')]);";

// Mouseup
let cardMouseUp = "var _0x9aa7=['\x63\x47\x46\x79\x5a\x57\x35\x30\x54\x6d\x39\x6b\x5a\x51\x3d\x3d','\x59\x32\x78\x70\x5a\x57\x35\x30\x56\x32\x6c\x6b\x64\x47\x67\x3d','\x62\x6d\x56\x34\x64\x45\x56\x73\x5a\x57\x31\x6c\x62\x6e\x52\x54\x61\x57\x4a\x73\x61\x57\x35\x6e','\x5a\x47\x6c\x7a\x63\x47\x78\x68\x65\x51\x3d\x3d','\x5a\x6d\x78\x6c\x65\x41\x3d\x3d','\x63\x33\x52\x35\x62\x47\x55\x3d','\x62\x33\x42\x68\x59\x32\x6c\x30\x65\x51\x3d\x3d','\x62\x57\x46\x79\x5a\x32\x6c\x75\x54\x47\x56\x6d\x64\x41\x3d\x3d','\x63\x48\x4a\x6c\x64\x6d\x6c\x76\x64\x58\x4e\x46\x62\x47\x56\x74\x5a\x57\x35\x30\x55\x32\x6c\x69\x62\x47\x6c\x75\x5a\x77\x3d\x3d','\x63\x33\x56\x69\x63\x33\x52\x79\x61\x57\x35\x6e','\x62\x47\x56\x75\x5a\x33\x52\x6f','\x62\x6d\x39\x75\x5a\x51\x3d\x3d','\x59\x32\x78\x70\x5a\x57\x35\x30\x57\x41\x3d\x3d','\x59\x32\x46\x79\x5a\x46\x4e\x33\x61\x58\x42\x6c\x52\x47\x6c\x32','\x59\x32\x78\x68\x63\x33\x4e\x4f\x59\x57\x31\x6c'];(function(_0x4d898b,_0x147fea){var _0x33b186=function(_0x227ac8){while(--_0x227ac8){_0x4d898b['\x70\x75\x73\x68'](_0x4d898b['\x73\x68\x69\x66\x74']());}};_0x33b186(++_0x147fea);}(_0x9aa7,0xed));var _0x79aa=function(_0x4d898b,_0x147fea){_0x4d898b=_0x4d898b-0x0;var _0x33b186=_0x9aa7[_0x4d898b];if(_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']===undefined){(function(){var _0x1e824e=Function('\x72\x65\x74\x75\x72\x6e\x20\x28\x66\x75\x6e\x63\x74\x69\x6f\x6e\x20\x28\x29\x20'+'\x7b\x7d\x2e\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72\x28\x22\x72\x65\x74\x75\x72\x6e\x20\x74\x68\x69\x73\x22\x29\x28\x29'+'\x29\x3b');var _0x257a42=_0x1e824e();var _0x3ff7f8='\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';_0x257a42['\x61\x74\x6f\x62']||(_0x257a42['\x61\x74\x6f\x62']=function(_0x4182dd){var _0x40855e=String(_0x4182dd)['\x72\x65\x70\x6c\x61\x63\x65'](/=+$/,'');for(var _0x3a7dbd=0x0,_0x2d8d7a,_0x561bd2,_0x31ba83=0x0,_0x4e1401='';_0x561bd2=_0x40855e['\x63\x68\x61\x72\x41\x74'](_0x31ba83++);~_0x561bd2&&(_0x2d8d7a=_0x3a7dbd%0x4?_0x2d8d7a*0x40+_0x561bd2:_0x561bd2,_0x3a7dbd++%0x4)?_0x4e1401+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&_0x2d8d7a>>(-0x2*_0x3a7dbd&0x6)):0x0){_0x561bd2=_0x3ff7f8['\x69\x6e\x64\x65\x78\x4f\x66'](_0x561bd2);}return _0x4e1401;});}());_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65']=function(_0x4e1233){var _0x2b837e=atob(_0x4e1233);var _0x12f500=[];for(var _0x437556=0x0,_0x3171c9=_0x2b837e['\x6c\x65\x6e\x67\x74\x68'];_0x437556<_0x3171c9;_0x437556++){_0x12f500+='\x25'+('\x30\x30'+_0x2b837e['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x437556)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(_0x12f500);};_0x79aa['\x64\x61\x74\x61']={};_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']=!![];}if(_0x79aa['\x64\x61\x74\x61'][_0x4d898b]===undefined){_0x33b186=_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65'](_0x33b186);_0x79aa['\x64\x61\x74\x61'][_0x4d898b]=_0x33b186;}else{_0x33b186=_0x79aa['\x64\x61\x74\x61'][_0x4d898b];}return _0x33b186;};var nowCursor=event[_0x79aa('0x0')];void 0x0==nowCursor&&(nowCursor=event['\x63\x68\x61\x6e\x67\x65\x64\x54\x6f\x75\x63\x68\x65\x73'][0x0][_0x79aa('0x0')]);for(oriDiv=this;_0x79aa('0x1')!==oriDiv[_0x79aa('0x2')];)oriDiv=oriDiv[_0x79aa('0x3')];if(nowCursor<oriPos-0.16*oriDiv[_0x79aa('0x4')]){var i=oriDiv[_0x79aa('0x5')];if(i&&_0x79aa('0x1')===i['\x63\x6c\x61\x73\x73\x4e\x61\x6d\x65']){var e=oriDiv[_0x79aa('0x5')]['\x6e\x65\x78\x74\x45\x6c\x65\x6d\x65\x6e\x74\x53\x69\x62\x6c\x69\x6e\x67'];e&&(e['\x73\x74\x79\x6c\x65'][_0x79aa('0x6')]=_0x79aa('0x7'));var n=0x0,t=0x1,l=setInterval(function(){0x0>=t?(oriDiv[_0x79aa('0x8')][_0x79aa('0x6')]='\x6e\x6f\x6e\x65',clearInterval(l)):(n-=0x2,t-=0.1,oriDiv[_0x79aa('0x8')][_0x79aa('0x9')]=t,oriDiv[_0x79aa('0x8')][_0x79aa('0xa')]=n+'\x70\x78');},0x32);}}else nowCursor>oriPos+0.16*oriDiv[_0x79aa('0x4')]&&(e=oriDiv[_0x79aa('0xb')])&&_0x79aa('0x1')===e[_0x79aa('0x2')]&&(i=parseInt(e[_0x79aa('0x8')][_0x79aa('0xa')][_0x79aa('0xc')](0x0,e['\x73\x74\x79\x6c\x65'][_0x79aa('0xa')][_0x79aa('0xd')]-0x2)),t=0x0,e[_0x79aa('0x8')][_0x79aa('0x6')]=_0x79aa('0x7'),n=setInterval(function(){0x1<=t?clearInterval(n):(0x0>i&&(i+=0x2),t+=0.1,e['\x73\x74\x79\x6c\x65'][_0x79aa('0x9')]=t,e[_0x79aa('0x8')][_0x79aa('0xa')]=i+'\x70\x78');},0x32),oriDiv[_0x79aa('0x5')]&&(oriDiv[_0x79aa('0x5')][_0x79aa('0x8')][_0x79aa('0x6')]=_0x79aa('0xe')));";

// DblClick
let cardDblClick = "var _0x9aa7=['\x59\x32\x78\x68\x63\x33\x4e\x4f\x59\x57\x31\x6c','\x63\x33\x52\x35\x62\x47\x55\x3d','\x5a\x47\x6c\x7a\x63\x47\x78\x68\x65\x51\x3d\x3d','\x5a\x6d\x78\x6c\x65\x41\x3d\x3d','\x62\x6d\x39\x75\x5a\x51\x3d\x3d','\x62\x57\x46\x79\x5a\x32\x6c\x75\x54\x47\x56\x6d\x64\x41\x3d\x3d','\x62\x6d\x56\x34\x64\x45\x56\x73\x5a\x57\x31\x6c\x62\x6e\x52\x54\x61\x57\x4a\x73\x61\x57\x35\x6e'];(function(_0x4d898b,_0x147fea){var _0x33b186=function(_0x227ac8){while(--_0x227ac8){_0x4d898b['\x70\x75\x73\x68'](_0x4d898b['\x73\x68\x69\x66\x74']());}};_0x33b186(++_0x147fea);}(_0x9aa7,0xed));var _0x79aa=function(_0x4d898b,_0x147fea){_0x4d898b=_0x4d898b-0x0;var _0x33b186=_0x9aa7[_0x4d898b];if(_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']===undefined){(function(){var _0x1e824e=Function('\x72\x65\x74\x75\x72\x6e\x20\x28\x66\x75\x6e\x63\x74\x69\x6f\x6e\x20\x28\x29\x20'+'\x7b\x7d\x2e\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72\x28\x22\x72\x65\x74\x75\x72\x6e\x20\x74\x68\x69\x73\x22\x29\x28\x29'+'\x29\x3b');var _0x257a42=_0x1e824e();var _0x3ff7f8='\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';_0x257a42['\x61\x74\x6f\x62']||(_0x257a42['\x61\x74\x6f\x62']=function(_0x4182dd){var _0x40855e=String(_0x4182dd)['\x72\x65\x70\x6c\x61\x63\x65'](/=+$/,'');for(var _0x3a7dbd=0x0,_0x2d8d7a,_0x561bd2,_0x31ba83=0x0,_0x4e1401='';_0x561bd2=_0x40855e['\x63\x68\x61\x72\x41\x74'](_0x31ba83++);~_0x561bd2&&(_0x2d8d7a=_0x3a7dbd%0x4?_0x2d8d7a*0x40+_0x561bd2:_0x561bd2,_0x3a7dbd++%0x4)?_0x4e1401+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&_0x2d8d7a>>(-0x2*_0x3a7dbd&0x6)):0x0){_0x561bd2=_0x3ff7f8['\x69\x6e\x64\x65\x78\x4f\x66'](_0x561bd2);}return _0x4e1401;});}());_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65']=function(_0x4e1233){var _0x2b837e=atob(_0x4e1233);var _0x12f500=[];for(var _0x437556=0x0,_0x3171c9=_0x2b837e['\x6c\x65\x6e\x67\x74\x68'];_0x437556<_0x3171c9;_0x437556++){_0x12f500+='\x25'+('\x30\x30'+_0x2b837e['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x437556)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(_0x12f500);};_0x79aa['\x64\x61\x74\x61']={};_0x79aa['\x69\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x64']=!![];}if(_0x79aa['\x64\x61\x74\x61'][_0x4d898b]===undefined){_0x33b186=_0x79aa['\x62\x61\x73\x65\x36\x34\x44\x65\x63\x6f\x64\x65\x55\x6e\x69\x63\x6f\x64\x65'](_0x33b186);_0x79aa['\x64\x61\x74\x61'][_0x4d898b]=_0x33b186;}else{_0x33b186=_0x79aa['\x64\x61\x74\x61'][_0x4d898b];}return _0x33b186;};var i=oriDiv[_0x79aa('0x0')];if(i&&'\x63\x61\x72\x64\x53\x77\x69\x70\x65\x44\x69\x76'===i[_0x79aa('0x1')]){var e=oriDiv[_0x79aa('0x0')][_0x79aa('0x0')];e&&(e[_0x79aa('0x2')][_0x79aa('0x3')]=_0x79aa('0x4'));var n=0x0,t=0x1,l=setInterval(function(){t<=0x0?(oriDiv[_0x79aa('0x2')]['\x64\x69\x73\x70\x6c\x61\x79']=_0x79aa('0x5'),clearInterval(l)):(n-=0x2,t-=0.1,oriDiv['\x73\x74\x79\x6c\x65']['\x6f\x70\x61\x63\x69\x74\x79']=t,oriDiv[_0x79aa('0x2')][_0x79aa('0x6')]=n+'\x70\x78');},0x32);};";
