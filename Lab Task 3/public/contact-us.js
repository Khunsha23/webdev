
          $(document).ready(function() {
              let nameField = $("#exampleInputName1");
              let emailField = $("#exampleInputEmail1");
              let genderField = $("#exampleFormControlSelect1");
              let messageField = $("#exampleInputMessag1");
      
              $("#submitbutton").click(function(event) {
                  event.preventDefault();
      
                  let selectedIndex = genderField.val();
      
                  check(nameField, 'nameDot');
                  check(emailField, 'emailDot');
                  check(genderField, 'genderDot');
                  check(messageField, 'messageDot');
      
                  if (!nameField.val() || !emailField.val() || selectedIndex <= 0 || !messageField.val()) {
                      console.log("Form is invalid");
                  } else {
                      console.log("Form is valid");
                  }
              });
      
              function check(field, dotId) {
                  let redDot = $("#" + dotId);
                  let selectedIndex = genderField.val();
                  if (field.is(genderField)) {
                      if (selectedIndex <= 0) {
                          redDot.text('•');
                      } else {
                          redDot.text('');
                      }
                  } else {
                      if (!field.val()) {
                          redDot.text('•');
                      } else {
                          redDot.text('');
                      }
                  }
              }
          });

      