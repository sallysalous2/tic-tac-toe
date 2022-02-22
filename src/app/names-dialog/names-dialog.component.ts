import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-names-dialog',
  templateUrl: './names-dialog.component.html',
  styleUrls: ['./names-dialog.component.scss']
})
export class NamesDialogComponent implements OnInit {
  borderSizes: Array<any> = [];
  examinationList: Array<number> = [];
  selectedBoardSize: number = 0;
  selectedExamination: number = 0;
  
  playersForm = new FormGroup({
    firstPlayer: new FormControl(null, [Validators.required]),
    secondPlayer: new FormControl(null, [Validators.required]),
    boardSize: new FormControl(null, [Validators.required]),
    examination: new FormControl(null, [Validators.required]),
  });
  

  constructor(public dialogRef: MatDialogRef<NamesDialogComponent>, private router: Router) { }

  ngOnInit(): void {
    this.initBorderSizes();
    this.initExamination();
  }

  initBorderSizes() {
    this.borderSizes = [];
    for (let i = 3; i < 11; i++) {
      this.borderSizes.push({
        value: i,
        text: `${i}x${i}`
      });
      this.selectedBoardSize = this.borderSizes[0].value;
      this.playersForm.controls.boardSize.setValue(this.borderSizes[0].value);
    }
  }
  initExamination() {
    this.examinationList = [];
    for (let i = 3; i <= this.selectedBoardSize; i++) {
      this.examinationList.push(i);
    }
    this.selectedExamination = this.examinationList[0];
    this.playersForm.controls.examination.setValue(this.examinationList[0]);
  }

  examinationChange(value: any) {
    this.selectedExamination = value;
  }
  boardSizeChange(value: any) {
    this.selectedBoardSize = value;
    this.initExamination();
  }

  onSubmit() {
    // Send player names when dialog is closed
    this.dialogRef.close({firstPlayer: this.playersForm?.controls.firstPlayer.value,
      secondPlayer: this.playersForm?.controls.secondPlayer.value,
      boardSize: this.playersForm?.controls.boardSize.value,
      examination: this.playersForm?.controls.examination.value,
    });
  }

  goToInstructions() {
    this.dialogRef.close({navigateion: 'navigate'});  
    this.router.navigate(['/instructions']);
  }


}
