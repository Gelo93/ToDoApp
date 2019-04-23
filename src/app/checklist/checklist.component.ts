import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { Checklist } from "./types";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.scss"],
  animations: [
    trigger("checklistSlider", [
      state(
        "hide",
        style({
          width: "0"
        })
      ),
      state(
        "show",
        style({
          width: "100%"
        })
      ),
      transition("hide <=> show", animate("200ms ease-out"))
    ]),
    trigger("flyInOut", [
      state(
        "in",
        style({
          transform: "translateX(0)"
        })
      ),
      transition("void => *", [
        style({ transform: "translateX(-100%)" }),
        animate(200)
      ]),
      transition("* => void", [
        animate(200, style({ transform: "translateX(100%)" }))
      ])
    ])
  ]
})
export class ChecklistComponent implements OnInit {
  public value: string = "";
  public id: number = 0;
  public inputSlider: string = "hide";
  public checklists: Array<Checklist> = [];

  @Output() remove = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  // Toggle to open/close input when clicking the + floating button. (could be done in html as attribute rather than method).
  // Test: the toggle would have moved changed when floating button is clicked.
  public toggleInput() {
    this.inputSlider = this.inputSlider == "show" ? "hide" : "show";
  }

  // Push value of input to Checklist Array when enter button is pressed.
  // Test: Create mock inputs and push to Checklist on submit.
  public submitToDo(value: string) {
    if (value) {
      let customObj = new Checklist();
      customObj.id = this.id++;
      customObj.title = value;
      customObj.checked = false;
      this.checklists.push(customObj);
    }

    this.id = this.id++;
    this.value = "";
  }

  // Push value of input to Checklist Array when enter key is pressed.
  // Test: Create mock inputs and push to Checklist on submit.
  public onKey(value: string, event: any) {
    let isEnter: boolean;
    isEnter = event.key == "Enter" ? true : false;

    if (value && isEnter) {
      let customObj = new Checklist();
      customObj.id = this.id++;
      customObj.title = value;
      customObj.checked = false;
      this.checklists.push(customObj);

      this.id = this.id++;
      this.value = "";
    }
  }

  // remove item of Checklist Array when enter remove button is pressed.
  // Test: Create mock inputs and check it exists (not -1) before removing from mock array.
  removeItem(item: Checklist) {
    const index = this.checklists.indexOf(item);

    if (index !== -1) {
      this.checklists.splice(index, 1);
    }
  }

  // Using Angulars Drag&Drop method to move items in the list.
  drop(event: CdkDragDrop<Checklist[]>) {
    moveItemInArray(this.checklists, event.previousIndex, event.currentIndex);
  }
}
