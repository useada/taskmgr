import { 
  Component, 
  Renderer2,
  ElementRef,
  ViewChild,
  OnDestroy 
} from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute } from '@angular/router';
import { Store } from "@ngrx/store";
import 'rxjs/add/operator/pluck';
import { Subscription } from "rxjs/Subscription";
import * as fromRoot from "../../reducers";
import * as actions from '../../actions/task-list.action';
import * as models from '../../domain';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
})
export class TaskHomeComponent implements OnDestroy{
  dragged;
  loading: boolean = true;
  lists$: Observable<models.TaskList[]>;
  drag$: Observable<models.TaskList>;
  drop$: Observable<models.TaskList>;
  routeParamSub: Subscription;
  constructor(
    private renderer: Renderer2, 
    private element: ElementRef,
    private route: ActivatedRoute,
    private store$: Store<fromRoot.State>) { 
      this.routeParamSub = this.route.params.pluck('id').subscribe(
        (id:string) => this.store$.dispatch(new actions.LoadTaskListsAction(id)));
      this.lists$ = this.store$.select(fromRoot.getTaskLists);
      this.drag$ = this.store$.select(fromRoot.getTaskDrag);
      this.drop$ = this.store$.select(fromRoot.getTaskDrop);
  }

  ngOnDestroy(){
    // 取消订阅以免内存泄露
    if(this.routeParamSub !== undefined && this.routeParamSub !== null)
      this.routeParamSub.unsubscribe();
  }

  onDragStart(e, src){
    this.store$.dispatch(new actions.DragAction(src.id));
    this.dragged = event.target;
    e.target.style.opacity=.5;
    e.target.style.border = "#ff525b dashed 2px"
  }
  onDragEnd(e){
    e.target.style.opacity=1;
    e.target.style.background = "#EEEEEE";
    e.target.style.border = "";
  }
  onDragOver(e){
    e.preventDefault();
  }
  onDrop(e, target){
    // prevent default action
    e.preventDefault();
    
    // move dragged elem to the selected drop target
    if (e.target.className == "list-container") {
      this.store$.dispatch(new actions.DropAction(target.id));
      e.target.style.background = "#EEEEEE";
    }
  }
  onDragEnter(e){
    // highlight potential drop target when the draggable element enters it
    if (e.target.className == "list-container" ) {
      e.target.style.background = "purple";
    }
  }
  onDragLeave(e){
    // reset background of potential drop target when the draggable element leaves it
    if (e.target.className == "list-container" ) {
      e.target.style.background = "#EEEEEE";
    }
  }
}
