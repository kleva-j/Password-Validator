//This runs when the window loads
window.onload = function start(){
  controller.init();
}

const controller = {
  init: function() {
    views.init();
  },

  validateInput: function(input){

    var messages = [
      {
        statusCode: 100,
        message: "Minimum length of password is 6"
      },
      {
        statusCode: 200,
        message: "Success"
      },
      {
        statusCode: 300,
        message: "Maximum length of password is 12"
      }
    ];

    if (input.length > 5 && input.length < 12) return { msg: messages[1], input: input};
    else if(input.length > 12) return { msg: messages[2], input: null };
    else return { msg: messages[0], input : null };
  },

  checkConditions: function(response) {
    var { msg, input } = response;
    var results = [];
    var patterns = [
      /[a-z]/,       // check for lowercase characters
      /[A-Z]/,       // check for uppercase characters
      /\d/,          // check for numeric characters
      /[@#&!]/    // check for special characters
    ];

    for (var pattern of patterns) {
      results.push(pattern.test(input));
    }

    if(!input) views.render({msg});
    return views.render({results, msg});
  }
}

const views = {

  init: function() {
    //this.sets the input field to be on focus once the page loads
    document.querySelector('.password').focus();
    
    //store pointers to our DOM elements for easy assess later.
    this.handle = document.querySelector('.details');    
    var submit = this.handle.parentElement;

    //on submit event for the form field
    submit.addEventListener('submit', function(e){
      e.preventDefault();
      var input = document.querySelector('.password');
      var status = controller.validateInput(input.value);
      var results = controller.checkConditions(status);
    });
  },

  render: function(data) {
    //store pointers to our DOM elements for easy assess later.
    var { msg, results } = data;
    var warning = this.handle.previousElementSibling;
    var indicators = Array.from(this.handle.children[0].children);
    var checkers = Array.from(this.handle.children[1].children).map(function (el) { return el.children[1]; } );
    var index = indicators.length - 1;

    //sets an initial state for the DOM elements.
    warning.textContent = '';
    indicators[index].textContent = 0 + '%';
    indicators[index].style.color = 'black';
    indicators.forEach(bar => bar.style.backgroundColor = 'white');
    checkers.forEach(check => check.style.visibility = 'hidden');

    if(msg.statusCode == 200) {
      for (var i = 0, j = 0; i<= results.length-1 ; i++) {
        if(results[i]) {
          ++j;
          checkers[i].style.visibility = 'visible';
        }
      }

      switch (j) {
        case 1:
          warning.textContent = 'Weak password'
          break;

        case 2:
          warning.textContent = 'Fairly strong password'
          break;

        case 3:
          warning.textContent = 'Strong password'
          break;

        case 4:
          warning.textContent = 'Very Strong password';
          break;
      }

      let percentage = j * 25;
      indicators[4].textContent = percentage + '%';
      indicators[4].style.color = 'green';

      for(var k = 0; k <= j-1; k++) {
        if(j == 0 || j == 1) indicators[k].style.backgroundColor = 'rgb(255, 0, 0)';
        else if(j == 2) indicators[k].style.backgroundColor = 'rgb(235, 165, 0)';
        else if(j == 3) indicators[k].style.backgroundColor = 'rgb(255, 255, 9)';
        else indicators[k].style.backgroundColor = 'rgb(35, 184, 90)';
      }
    }

    else{
      warning.textContent = msg.message;
    }
  }
}

