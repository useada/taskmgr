import { 
  Component, 
  OnInit, 
  Inject, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { 
  FormGroup, 
  FormBuilder, 
  FormControl,
  Validators 
} from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/map';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProjectComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;
  thumbnails$: Observable<string[]>;
  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>,
    @Inject(MD_DIALOG_DATA) private data: any,
    private dialogRef: MdDialogRef<NewProjectComponent>) { }

  ngOnInit() {
    if(this.data.project === undefined || this.data.project === null) {
      const img = `/assets/img/covers/${Math.floor(Math.random()*39).toFixed(0)}_tn.jpg`
      this.form = this.fb.group({
        name: ['', Validators.required],
        desc: [''],
        coverImg: [img]
      });
      this.dialogTitle = '创建项目：';
    }
    else {
      this.form = this.fb.group({
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg]
      });
      this.dialogTitle = '修改项目：';
    }
    this.thumbnails$ = Observable
      .range(0, 40)
      .map(i => `/assets/img/covers/${i}_tn.jpg`)
      .reduce((r,x) => {
        return [...r, x]
      }, []);
  }

  onSubmit({value, valid}, event: Event){
    event.preventDefault();
    if(!valid) return;
    if(this.data.project === undefined || this.data.project === null)
      this.store$.dispatch(
        new actions.AddProjectAction({
          name: value.name,
          desc: value.desc,
          coverImg: value.coverImg.split('_', 1)[0]+'.jpg'
        }));
    else
      this.store$.dispatch(
        new actions.UpdateProjectAction({
          id: this.data.project.id,
          name: value.name,
          desc: value.desc,
          coverImg: value.coverImg.split('_', 1)[0]+'.jpg'
        }));
    this.dialogRef.close();
  }

}
