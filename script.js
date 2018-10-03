/*
to do:
+blocks width needs refine, now doesn't display properly when ects is much bigger


maybe:
?

issues:
!

*/


let unfoldMe = document.querySelectorAll('.unfoldMe');

// arrow.forEach(clickArrow);
unfoldMe.forEach(clickArrowunfoldMe);

function clickArrowunfoldMe(a) {
  a.addEventListener('click', unfoldMeNow);

  function unfoldMeNow() {
    a.parentElement.classList.toggle('unfold');
  }
}


// get info for each semester
let ectsS = [];
let allEcts;
let allEctsS = [];
fetch("try.json").then(result => result.json()).then(semesters => generateForEachSemester(semesters));

function generateForEachSemester(semesters) {
  semesters.forEach(createBlocks);

  function createBlocks(semester, index) {
    let semesterNr = index + 1;
    allEcts = 0;
    let thisSemester = document.querySelector('.semester:nth-of-type(' + semesterNr + ') .blocks');
    const blocks = semester.components; // array
    blocks.forEach(block => {
      allEcts += block.ects;
      ectsS.push(block.ects);
      let generatedBlock = document.createElement('div');
      generatedBlock.style.textAlign = "center";
      generatedBlock.classList.add('block');
      let h3 = document.createElement('h3');
      h3.textContent = block.name;
      h3.style.display = "inline-block";
      h3.style.color = "white";
      let credit = document.createElement('span');
      credit.textContent = "ECTS: " + block.ects;
      credit.style.marginLeft = "30px";
      let content = document.createElement('p');
      content.innerHTML = block.content;
      let plus = document.createElement('p'); // need change later
      plus.style.textAlign = "right";
      plus.style.marginRight = "30px";
      plus.classList.add('expand');
      plus.innerHTML = "<span class=\"arrow white\"></span>";
      plus.style.fontSize = "26px";
      plus.style.position = "relative";
      plus.style.top = "-10px";
      let details = document.createElement('div');
      details.className = "hide details"; // need change later
      details.style.backgroundColor = "white";
      details.innerHTML = block.details;
      details.style.padding = "30px";
      details.style.display = "hide grid";
      generatedBlock.appendChild(h3);
      generatedBlock.appendChild(credit);
      generatedBlock.appendChild(content);
      generatedBlock.appendChild(plus);
      generatedBlock.appendChild(details);
      thisSemester.appendChild(generatedBlock);
    });
    // expand details for each semester
    let expandS = document.querySelectorAll(".expand");
    expandS.forEach(showDetail);

    function showDetail(e, index) {
        if(window.innerWidth>1280){
          // click on each expand, opens the corresponding detail section. allow open multiple details
          e.addEventListener("click", displayIndivdual);
        } else {
            // on narrower screen, use full width, so can't have columns, so for the 3rd and the 4th semesters, even the titles are in 2 columns, content need to use full width
            e.addEventListener('click', displayOnlyOneDetail);
        }
      function displayIndivdual() {
          e.style.display="none"; // hide expand button after clicking, temp solution
        e.nextElementSibling.style.display = "grid"; // display grid and display none by hide have conflict, so set this way
          e.nextElementSibling.style.gridGap = "20px";
        if (index < 3) {
          e.nextElementSibling.classList.remove("hide");
          e.nextElementSibling.style.gridTemplateColumns = "1fr 1fr";
        } else if (index >= 3) {
          e.nextElementSibling.classList.remove("hide");
          e.nextElementSibling.style.gridTemplateColumns = "1fr";
        }
      }
        function displayOnlyOneDetail(){
          e.style.display="none"; // hide expand button after clicking, temp solution
//          e.nextElementSibling.style.display = "grid"; // display grid and display none by hide have conflict, so set this way
          e.nextElementSibling.style.gridGap = "20px";
          e.nextElementSibling.classList.remove("hide");
          e.nextElementSibling.style.gridTemplateColumns = "1fr";
            e.nextElementSibling.style.width = "100vw";
            e.nextElementSibling.style.height = "100vh";
            e.nextElementSibling.style.overflow = "scroll";
            e.nextElementSibling.style.position = "fixed";
            e.nextElementSibling.style.top = "0";
            e.nextElementSibling.style.zIndex = "17";
            e.nextElementSibling.style.position = "fixed";
            if(window.innerWidth>700){
                e.nextElementSibling.style.padding = "15%";
                e.nextElementSibling.style.top = "50px";
                e.nextElementSibling.style.height = "calc(100vh - 50px)";
            }
        }
      // close details for each
      let xS = document.querySelectorAll('.x');
      xS.forEach(closeDetail);

      function closeDetail(e) {
        e.addEventListener('click', closeIndividual);

        function closeIndividual() {
          console.log('close'); // run 12 times.....
            e.parentElement.previousElementSibling.style.display = "inherit";
          if (e.parentElement.parentElement.firstElementChild.textContent == "Electives") {

          }
          e.parentElement.style.display = "none";
          // flash expand icons in order
          e.style.animation = "flash 2s " + (index * 1) + "s 1";
        }
        function closeIndividualNarrow(){
            e.parentElement.previousElementSibling.style.display = "inherit";
            e.parentElement.style.display = "none";
            e.parentElement.parentElement.style.height = "auto";
        }
      }
    }



    // set block width, need to run this after allEcts for whole semester(more than one blocks) is calculated
    for (i = 0; i < ectsS.length; i++) {
      thisSemester.style.gridTemplateColumns = "repeat(" + allEcts + ", 1fr)";
      document.querySelectorAll('.block')[i].style.gridColumn = "span " + ectsS[i];
      document.querySelectorAll('.details')[i].style.gridColumn = "span " + ectsS[i];
    }
    allEctsS.push(allEcts);

    /* in case some semester has more ECTS than others */
    let longestBar = Math.max(...allEctsS); // the ... is because allEctsS is an array, can't use Math.max directly. can also use Math.max.apply(null, array)
    for (i = 0; i < semesters.length; i++) {
      document.querySelector('.semester:nth-of-type(' + (i + 1) + ') .blocks').style.width = allEctsS[i] / longestBar * 100 + "%";
    }
  }
}


// fix navi to top after scroll and show kea log + search
const nav = document.querySelector('nav');
const main = document.querySelector('main');
const coreAreas = document.querySelector('#coreAreas'); // cuz nav will be fixed later, don't rely the trigger on nav itself, rather the one below nav, so grab this element
const semesterPlan = document.querySelector('#programStructure');
const exams = document.querySelector('#exams');
const other = document.querySelector('#other');
const keaLogo = document.querySelector('.kea-logo');
const search = document.querySelector('.search');




if(window.innerWidth > 1000){  // if check this way, resizing window to wider than 1000px won't trigger the function, need to add eventListener of resizing to window
    window.addEventListener('scroll', getAndCheckNavOffsetTop);
} else if(window.innerWidth < 1000){ // change burger menu color to it's visible on all backgound
    let burgerLines = document.querySelectorAll('#menuToggle span');
    window.addEventListener('scroll', changeBurger);
    function changeBurger(){
        let corePosition = coreAreas.getBoundingClientRect();
        if (corePosition.top <= 0){
            burgerLines.forEach(l=>{l.style.backgroundColor="black"});
        } else {
            burgerLines.forEach(l=>{l.style.backgroundColor="white"});
        }

    }
}

function getAndCheckNavOffsetTop() {
  let offset = coreAreas.getBoundingClientRect();
  if (offset.top <= 115) {
    nav.style.position = "fixed";
    nav.style.top = "-45px"; // don't know why -45...
    nav.style.width = "100vw";
    coreAreas.style.top = "70px";
    semesterPlan.style.top = "70px"; // all the following div need to change accordingly as well. Strange.... don't need to change back when scroll back up
    exams.style.top = "70px";
    other.style.top = "70px";
    nav.classList.add('show');
    keaLogo.classList.add('show');
    search.classList.add('show');
  } else {
    nav.style.position = "inherit";
    nav.style.top = "0px";
    coreAreas.style.top = "0";
    nav.classList.remove('show');
    keaLogo.classList.remove('show');
    search.classList.remove('show');
  }
}

//search
search.addEventListener('mouseenter', ()=>search.textContent = "doesn't work yet");
search.addEventListener('mouseleave', ()=>search.textContent = "SEARCH ___________");

let blockS = document.querySelectorAll('.block');
blockS.forEach(clickEachSemester);
function clickEachSemester(b){
    b.addEventListener('click', expandDetail);
    function expandDetail(){
        b.querySelector('div.details').style.height = "auto";
    }
}
