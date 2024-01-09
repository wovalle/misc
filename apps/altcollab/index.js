/*!
 * theroomjs v2.1.6
 * A vanilla javascript plugin that allows you to outline DOM elements like web inspectors
 * It's compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer
 * MIT License
 * by Huseyin ELMAS
 */
// prettier-ignore
!function(c,l,o){function n(e){if(!1!==a("hook",e)){var t=e.target;if(t&&t!==p.inspector){var o,n,r,i,s=p.excludes.join(",");if(s)if(0<=Array.prototype.slice.call(l.querySelectorAll(s)).indexOf(t))return;"mouseover"===e.type&&(o=t.getBoundingClientRect(),r=c.scrollY||l.documentElement.scrollTop,i=c.scrollX||l.documentElement.scrollLeft,n=o.width,s=o.height,r=Math.max(0,o.top+r),i=Math.max(0,o.left+i),p.inspector.style.top=r+"px",p.inspector.style.left=i+"px",p.inspector.style.width=n+"px",p.inspector.style.height=s+"px"),a(e.type,t,e)}}}function t(e){var t=l.querySelector("html");"start"===e?(!0===p.blockRedirection&&(c.onbeforeunload=function(){return!0}),l.addEventListener("click",n),l.addEventListener("mouseover",n),!0===p.htmlClass&&(t.className+=" "+o),r="running"):"stop"===e&&(l.removeEventListener("click",n),l.removeEventListener("mouseover",n),!0===p.htmlClass&&(t.className=t.className.replace(" "+o,"")),!0===p.blockRedirection&&(c.onbeforeunload=void 0),r="stopped")}var r="idle",p={inspector:null,htmlClass:!0,blockRedirection:!1,createInspector:!1,excludes:[]},a=function(e,t,o){if(p[e]){if("function"!=typeof p[e])throw Error("event handler must be a function: "+e);return p[e].call(null,t,o)}};c[o]={start:function(e){e&&this.configure(e),p.inspector=function(){if("string"==typeof p.inspector){var e=l.querySelector(p.inspector);if(e)return e;throw Error("inspector element not found")}if(p.inspector instanceof Element)return p.inspector;if(p.inspector||!p.createInspector)throw Error("inspector must be a css selector or a DOM element");e=l.createElement("div");return e.className="inspector-element",l.body.appendChild(e),e}(),a("starting"),t("start"),a("started")},stop:function(e){a("stopping"),t("stop"),!0===e&&(p.inspector.style.top="",p.inspector.style.left="",p.inspector.style.width="",p.inspector.style.height=""),!0===p.createInspector&&(p.inspector.remove(),p.inspector=void 0),a("stopped")},on:function(e,t){if("string"!=typeof e)throw Error("event name is expected to be a string but got: "+typeof e);if("function"!=typeof t)throw Error("event handler is not a function for: "+e);p[e]=t},configure:function(e){!function(e){if("object"!=typeof e)throw Error("options is expected to be an object");for(var t in e)e.hasOwnProperty(t)&&(p[t]=e[t])}(e)},status:function(){return r}}}(window,document,"theRoom");

(() => {
  // code start
  function getDomPath(el) {
    const stack = [];

    while (el.parentNode !== null) {
      let sibCount = 0;
      let sibIndex = 0;
      for (let i = 0; i < el.parentNode.childNodes.length; i += 1) {
        const sib = el.parentNode.childNodes[i];
        if (sib.nodeName === el.nodeName) {
          if (sib === el) {
            sibIndex = sibCount;
            break;
          }
          sibCount += 1;
        }
      }

      const nodeName = CSS.escape(el.nodeName.toLowerCase());

      // Ignore `html` as a parent node
      if (nodeName === "html") break;

      if (el.hasAttribute("id") && el.id !== "") {
        stack.unshift(`#${CSS.escape(el.id)}`);
        // Remove this `break` if you want the entire path
        break;
      } else if (sibIndex > 0) {
        // :nth-of-type is 1-indexed
        stack.unshift(`${nodeName}:nth-of-type(${sibIndex + 1})`);
      } else {
        stack.unshift(nodeName);
      }

      el = el.parentNode;
    }

    return stack;
  }

  function addComment(comment) {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));

    markComment(comment);
  }

  function markComment(comment) {
    const { path, text } = comment;

    const elem = document.querySelector(path);
    if (elem) {
      elem.style.position = "relative";
      const div = document.createElement("div");
      div.style.backgroundColor = "tomato";
      div.style.width = "10px";
      div.style.height = "10px";
      div.style.display = "block";
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.right = "-10px";
      div.dataset.text = text;
      div.dataset.foo = "bar";
      div.onclick = (e) => {
        e.preventDefault();
        alert(text);
      };

      elem.append(div);
    }
  }

  function loadComments() {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    comments.forEach((c) => markComment(c));
  }

  function configureTheRoom() {
    console.log("the room loaded");
    window.theRoom.configure({
      blockRedirection: true,
      createInspector: true,

      excludes: [],
      click: function (element, event) {
        const text = prompt("Please enter your comment");
        const path = getDomPath(element).join(">");

        addComment({ path, text });
      },
    });

    // inject style
    const style = document.createElement("style");
    style.textContent = `
  .inspector-element {
    position: absolute;
    pointer-events: none;
    border: 2px solid tomato;
    transition: all 400ms;
    background-color: rgba(180, 187, 105, 0.1);
  }`;

    document.head.append(style);

    // ignore click events
    window.theRoom.on("hook", (e) => {
      if (e.type === "click") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.target.dataset.foo === "bar") {
        return false;
      }

      return true;
    });

    // inspection has started
    window.theRoom.start();
  }

  configureTheRoom();
  loadComments();
})();
