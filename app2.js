(function () {
    var model = {
      key: 'students',
      init: function () {
        localStorage.setItem(this.key, JSON.stringify([]));
      },
      get: function () {
        var students = localStorage.getItem(this.key);
        return JSON.parse(students);
      },
      save: function (student) {
        var students = this.get(); //untuk objek siswa
        students.push(student);
        var num = students.length;
        students = JSON.stringify(students);
        localStorage.setItem(this.key, students);
      },
      update: function (students) {
        var str = JSON.stringify(students);
        localStorage.setItem(this.key, str);
      },
      clearAll: function () {
        this.init();
      }
    };
    var octopus = {
      init: function () {
        view.init();
        var students = this.getStudents();
        if (students) {
          console.log('im here every time');
        } else {
          model.init();
          console.log('init db with key');
        }
        this.renderAllStudents();
      },
      //berfungsi untuk mendapatkan semua siswa dari model
      getStudents: function () {
        return model.get();
      },
      renderStudent: function (name, days) {
        var students = octopus.getStudents();
  
        this.tbody = document.querySelector('tbody');
        var nameCol = document.createElement('td');
        nameCol.setAttribute('class', 'name-col');
        nameCol.textContent = name;
  
        var studentTR = document.createElement('tr');
        this.missed = 0;
        studentTR.classList.add('student');
        studentTR.appendChild(nameCol);
  
        // Membuat 12 kotak kosong untuk harinya
        for (var i = 0; i < 12; i++) {
          var checkbox = document.createElement('input');
          var tdAttendCol = document.createElement('td');
  
          tdAttendCol.setAttribute('class', 'attend-col');
          checkbox.setAttribute('type', 'checkbox');
          checkbox.checked = days[i];
  
          if (!days[i]) {
            this.missed++;
          }
  
          tdAttendCol.appendChild(checkbox);
          studentTR.appendChild(tdAttendCol);
  
        };
        this.misedCol = document.createElement('td');
        this.misedCol.setAttribute('class', 'missed-col');
        this.misedCol.textContent = this.missed;
        studentTR.appendChild(this.misedCol);
        //Menambahkan tabel
        this.tbody.appendChild(studentTR);
      },
      renderAllStudents: function () {
        this.students = this.getStudents(); //arr of obj students
        for (var i = 0; i < this.students.length; i++) {
          this.renderStudent(this.students[i].name, this.students[i].days);
        }
  
      },
      addNewStudent: function (name) {
        //untuk icon submit nama siswa
        //Untuk menghasilkan array 12 false 
        function generateDays() {
          var days = [];
          for (var i = 0; days.length < 12; i++) {
            days.push(false);
          }
          return days;
        }
        var dayFalse = generateDays();
        var student = {
          name: name,
          days: dayFalse
        };
        model.save(student);
        octopus.renderStudent(name, dayFalse);
  
      },
      update: function (id, checkboxes, classStudent) {
  
        var students = this.getStudents(),
          missingDays,
          missed = classStudent.querySelector('.missed-col'),
  
          
          pos = students.map(function (obj) {
            return obj.name
          }).indexOf(id),
          i, arr = [];
        for (i = 0; i < checkboxes.length; i++) {
          var box = checkboxes[i];
          arr.push(box.checked);
        }
        students[pos].days = arr;
        missingDays = arr.filter(function (item) {
          return !item;
        }).length;
  
        missed.textContent = missingDays;
  
        model.update(students);
      },
      delAll: function () {
        console.log('del all is on');
        model.clearAll();
        this.tbody.innerHTML = '';
  
      }
    };
    var view = {
      init: function () {
  
        var table = document.querySelector('tbody');
        table.addEventListener('click', function (e) {
          if (e.target.type !== undefined) {
            var classStudent = e.target.parentElement.parentElement;
            var id = classStudent.firstElementChild.textContent;
            var checkboxes = classStudent.querySelectorAll('input');
            octopus.update(id, checkboxes, classStudent);
          };
  
  
        });
        this.formStudent = document.forms[0];
        var del = this.formStudent.elements.del;
  
        del.addEventListener('click', e => {
          octopus.delAll();
          e.preventDefault();
        });
  
        this.formStudent.addEventListener('submit', e => {
          var student = e.target.elements[0];
          if (student.value) {
            octopus.addNewStudent(student.value);
            student.value = '';
          };
          e.preventDefault();
  
        });
      }
    };
    octopus.init();
  }());
  