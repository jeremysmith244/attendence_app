
class Student {
    constructor(name,days) {
        this.name = name;
        this.days = days;
        this.attendance = [];
        // By default, students attend no days
        for (var i=0; i<days; i++) {
            this.attendance.push(false);
        }
        return 1;
    }
    changeDay = function(day) {
        var dayOfInterest = this.attendance[day];
        if (dayOfInterest) {
            this.attendance[day] = false;
        } else {
            this.attendance[day] = true;
        }
        return 1;
    }
};

/* STUDENT APPLICATION */
$(function() {
    var model = {
        init: function(studentNames,numDays) {
            this.numStudents = studentNames.length;
            this.numDays = numDays;
            this.students = [];
            for (var i=0; i<this.numStudents; i++) {
                var student = new Student(studentNames[i],this.numDays);
                this.students.push(student);
            }
        },
        changeStudentDay: function(studentNum,dayNum) {
            this.students[studentNum].changeDay(dayNum);
        },
        countDays: function(studentNum) {
            var a = this.students[studentNum].attendance;
            var sum = a.reduce(function(a, b) { return a + b; }, 0);
            return sum;
        }
    };

    var view = {
        init: function(numDays) {
            this.tableBody = $("#student-table");
            this.tableHead = $("#student-head");
            this.numDays = numDays;
            var viewStudents = octopus.getStudents();
            view.makeHeader(this.numDays);
            viewStudents.forEach(function(student,studInd) {
                view.addRow(student.name,studInd);
            });
        },
        makeHeader: function(numDays) {
            var col1 = document.createElement("th");
            col1.className = "name-col";
            col1.innerHTML = "Student Name";
            this.tableHead.append(col1);
            for (var i=0; i< this.numDays; i++) {
                var cell = document.createElement("th");
                cell.innerHTML = i;
                this.tableHead.append(cell);
            }
            var coln = document.createElement("th");
            coln.innerHTML = "Days Missed-col";
            coln.className = "missed-col";
            this.tableHead.append(coln);
        },
        addRow: function(name,rowNum) {
            var row = document.createElement("tr");
            row.id = "row-" + rowNum;
            nameCell = document.createElement("td");
            nameCell.innerHTML = name;
            row.append(nameCell);
            for (var i=0; i<this.numDays; i++) {
                var cell = document.createElement("td");
                cell.id = "cell-" + i;
                var inp = document.createElement("input");
                inp.type = "checkbox";
                inp.addEventListener("click", (function(iCopy) {
                    return function() {
                    octopus.setBox(rowNum,iCopy);
                }})(i));
                cell.append(inp);
                row.append(cell);
            }
            countCell = document.createElement("td");
            countCell.innerHTML = this.numDays;
            row.append(countCell);
            this.tableBody.append(row);
        },
        setCell: function(rowNum,cellNum,checked) {
            var row = $("#row-" + rowNum);
            cell = row.children()[cellNum+1];
            if (checked){
                cell.prop = "checked";
            } else {
                cell.prop = "";
            }
            return 1;
        },
        setSum: function(rowNum,sum) {
            var countCell = $("#row-" + rowNum).children()[this.numDays+1];
            countCell.innerHTML = this.numDays - sum;
        },
        renderCells: function() {
            var viewStudents = octopus.getStudents();
            viewStudents.forEach(function(student,studInd) {
                student.attendance.forEach(function(attended,dayInd) {
                    view.setCell(studInd,dayInd,attended);
                })
            })
        }
    };

    var octopus = {
        init: function() {
            this.studentNames = ["bob","slob","nob","todd","rodd"];
            this.numStudents = this.studentNames.length;
            this.numDays = 17;
            model.init(this.studentNames,this.numDays);
            view.init(this.numDays);
        },
        getStudents: function() {
            return model.students;
        },
        setBox: function(studentNum,dayNum) {
            model.changeStudentDay(studentNum,dayNum);
            view.renderCells();
            octopus.updateSum();
        },
        updateSum: function() {
            for (var i=0; i<this.numStudents; i++) {
                var sum = model.countDays(i);
                view.setSum(i, sum);
            }
        }
    };

    octopus.init();
}());
