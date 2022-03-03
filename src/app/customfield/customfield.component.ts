import {
  Component,
  EventEmitter,
  forwardRef,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/* had ik ergens gevonden in de SD BeOne lib */
@Injectable()
export abstract class BaseControlValueAccessor<T>
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public input: AbstractControl = new FormControl(null);
  public disabled = false;
  public readonly = false;
  public value: T;

  // tslint:disable-next-line:no-output-native
  @Output() public readonly blur: EventEmitter<any> = new EventEmitter();

  protected destroy$ = new Subject<boolean>();
  protected control: AbstractControl;

  // tslint:disable-next-line:contextual-lifecycle
  public ngOnInit(): void {
    this.input.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: T) => {
        this.value = val;
        this.onChange(val);
      });
  }
  /**
   * Call when value has changed programmatically
   */
  public onChange = (newVal: T): void => {
    /** */
    console.log('changed', newVal);
  };
  public onTouched = (_?: any): void => {
    /** */
  };

  /**
   * Model -> View changes
   */

  public writeValue(value: T): void {
    this.input.setValue(value);
    this.onChange(value);
  }
  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  public markAsDirty(): void {
    this.input.markAsDirty();
  }

  public markAsTouched(): void {
    this.input.markAsTouched();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public validate = (ctrl: AbstractControl): ValidationErrors => {
    if (!this.control && ctrl) {
      const value = this.input.value;
      this.input = new FormControl(value, {
        updateOn: ctrl.updateOn,
        validators: this.input.validator,
      });
      this.ngOnInit();
    }
    return this.input.errors;
  };
}

@Component({
  selector: 'app-customfield',
  templateUrl: './customfield.component.html',
  styleUrls: ['./customfield.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomfieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomfieldComponent),
      multi: true,
    },
  ],
})
export class CustomfieldComponent
  extends BaseControlValueAccessor<any>
  implements OnInit
{
  @Input()
  data: any;
  @Output()
  dataChange: EventEmitter<any> = new EventEmitter();
  @Input()
  required: boolean;
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    console.log('required', this.required);
    if (this.required) {
      this.input.setValidators([Validators.required]);
      this.input.updateValueAndValidity();
    }
    console.log('value', this.input.value);
    console.log(this.input.valid);
  }

  changeModel = (e: any) => {
    this.dataChange.next(e);
    this.writeValue(e);
  };
}
