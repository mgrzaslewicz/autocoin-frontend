import {Component, OnInit, ViewChild} from '@angular/core';
import {routerTransition} from '../router.animations';
import {NgForm} from '@angular/forms';
import {SignupService} from '../services/signup.service';
import {ToastService} from '../services/toast.service';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    @ViewChild('signupForm')
    public signupForm: NgForm;
    @ViewChild('iframe', { static: true })
    public iframe: any;
    public isShowingThankYou = false;
    public isSubmitInProgress = false;
    public email: string;
    public questionOne = '';
    public isEmailInvalid = false;
    public isQuestionOneInvalid = false;

    constructor(private signupService: SignupService, private toastService: ToastService) {
    }

    ngOnInit() {
    }

    onGoogleIframeLoad(e) {
        console.log('onLoad executed', e);
    }

    private showThankYou() {
        this.isShowingThankYou = true;
    }

    onSubmit(signupForm) {
        let canSubmit = true;
        if (!this.isEmailValid()) {
            this.isEmailInvalid = true;
            canSubmit = false;
        }
        if (this.questionOne.length === 0) {
            this.isQuestionOneInvalid = true;
            canSubmit = false;
        }
        if (canSubmit) {
            console.log(this.email);
            this.iframe.nativeElement.addEventListener('load', this.onGoogleIframeLoad.bind(this));
            this.isSubmitInProgress = true;
            this.copyInputsToHiddenGoogleFormAndSubmit();
            this.copyInputsToHiddenAutoresponderFormAndSubmit();
            this.signupService.signup(this.email).subscribe(() => {
                this.showThankYou();
            }, error => {
                this.isSubmitInProgress = false;
                console.error(error);
                this.toastService.warning('Could not register, please try again');
            });
        }
    }

    public isEmailValid(): boolean {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email);
    }

    public onEmailInput() {
        this.isEmailInvalid = false;
    }

    public onQuestionOneInput() {
        this.isQuestionOneInvalid = false;
    }

    private copyInputsToHiddenGoogleFormAndSubmit() {
        document.getElementById('googleFormEmailAddress').setAttribute('value', this.email);
        document.getElementById('googleFormQ1').setAttribute('value', this.questionOne);
        document.getElementById('googleFormQ2').setAttribute('value', (<HTMLInputElement>document.getElementById('question2')).value);
        (<HTMLFormElement>document.getElementById('googleForm')).submit();
    }

    private copyInputsToHiddenAutoresponderFormAndSubmit() {
        document.getElementById('autoresponderEmailAddress').setAttribute('value', this.email);
        (<HTMLFormElement>document.getElementById('autoresponderForm')).submit();
    }

}
