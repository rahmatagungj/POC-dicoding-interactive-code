import axios from "axios"

const DEFAULT_CODE = `function firstDuplicateValue(array) {
  let minimumSecondIndex = array.length
  for (let i = 0; i < array.length; i++) {
    const value = array[i]
    for (let j = i + 1; j < array.length; j++) {
      const valueToCompare = array[j]
      if (value === valueToCompare) {
        minimumSecondIndex = Math.min(minimumSecondIndex, j)
      }
    }
  }

  if (minimumSecondIndex === array.length) return -1

  return array[minimumSecondIndex]
}

for (let i = 0; i < 10; i++) {
  console.log(firstDuplicateValue([i,2,i,i,4,i]))
}
`

const definition = document.getElementById('interactive-code-editor');

const config = {
  tabSize: 2,
  mode: 'javascript',
  theme: 'idea',
  styleActiveLine: true,
};

disini 
// eslint-disable-next-line
const editor = CodeMirror.fromTextArea(definition, config);

editor.on('change', (editor) => {
  localStorage.setItem('interactive-code', JSON.stringify(editor.getValue()));
})

const isSaved = localStorage.getItem('interactive-code');
if (isSaved) {
  editor.setValue(JSON.parse(isSaved))
} else {
  editor.setValue(DEFAULT_CODE);
}

// set default of editor to empty string
editor.save()

editor.setSize("100%", "500px")

const tutorialSection = document.getElementById('interactive-code-tutorial');
const codeSection = document.getElementById('interactive-code-code');
const outputSection = document.getElementById('interactive-code-output');
const interactiveCodeContainer = document.getElementById("interactive-code")

let isFullscreen = false;

document.getElementById('interactive-code-input__checkbox').addEventListener('change', (event) => {
  if (event.target.checked) {
    document.getElementById('interactive-code-input').style.display = 'block';
    outputSection.style.minHeight = interactiveCodeContainer.offsetHeight + "px";
    document.getElementById("interactive-code-actions").classList.add("border-top")
    document.getElementById("interactive-code-actions").classList.add("pt-4")
  } else {
    document.getElementById('interactive-code-input').style.display = 'none';
    outputSection.removeAttribute('style');
    document.getElementById("interactive-code-actions").classList.remove("border-top")
    document.getElementById("interactive-code-actions").classList.remove("pt-4")
  }
})


document.getElementById("interactive-code-output__button-fullscreen").addEventListener("click", function () {
  outputSection.style.height = interactiveCodeContainer.offsetHeight + "px";

  if (!isFullscreen) {
    tutorialSection.style.display = "none";
    codeSection.style.display = "none";
    outputSection.classList.remove("col-md-3")
    outputSection.classList.add("col-12")
    isFullscreen = true;
  } else {
    tutorialSection.style.display = "block";
    codeSection.style.display = "block";
    outputSection.classList.remove("col-12")
    outputSection.classList.add("col-md-3")
    isFullscreen = false;
  }
})

let isShowingSetting = false
document.getElementById('interactive-code__button-setting').addEventListener('click', () => {
  if (!isShowingSetting) {
    document.getElementById('interactive-code-setting').style.display = 'block';
    isShowingSetting = true;
  } else {
    document.getElementById('interactive-code-setting').style.display = 'none';
    isShowingSetting = false;
  }
})

let isLoading = false;

document.getElementById("run-code").addEventListener('click', () => {
  if (isLoading) return;

  isLoading = true;
  document.getElementById("run-code").classList.add("disabled")
  document.getElementById("run-code").innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>`;

  setTimeout(async () => {
    await axios({
      method: "post",
      url: "https://x-runner.dicoding.com:8443/run",
      headers: {
        "X-Access-Token": "WGkG3Hv3BHJXna",
      },
      data: {
        "image": "glot/javascript:latest",
        "payload": {
          "language": "javascript",
          "files": [
            {
              "name": "main.js",
              "content": editor.getValue() || "",
              "stdin": document.getElementById("interactive-code-input__input").value || ""
            }
          ]
        }
      }
    }).then(function (response) {
      document.getElementById("code-output").innerHTML = response.data.stdout.replace(/\n/g, "<br>") || response.data.stderr;
    }).catch(function (error) {
      document.getElementById("code-output").innerHTML = error.response.data.message;
    });

    isLoading = false;
    document.getElementById("run-code").classList.remove("disabled")
    document.getElementById("run-code").innerHTML = "Jalankan";
  }, 100);
})

document.getElementById("reset-code").addEventListener('click', () => {
  editor.setValue(DEFAULT_CODE);
  document.getElementById("code-output").innerHTML = `<p class="code-output--hint">Jalankan kode untuk melihat output</p>`;
})


// theme system for light and dark 
let theme = "light";

document.getElementById("btn-theme").addEventListener('click', () => {
  interactiveCodeContainer.classList.toggle("interactive-code--dark")

  if (theme === "light") {
    theme = "dark";
    editor.setOption("theme", "blackboard");
  } else {
    theme = "light";
    editor.setOption("theme", "idea");
  }
})
