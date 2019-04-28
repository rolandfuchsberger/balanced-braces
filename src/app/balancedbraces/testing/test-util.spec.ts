export function checkValidationCssClasses(inputElement: any, classToBeSet: string) {
    const classList = ['ng-pending', 'ng-valid', 'ng-invalid'];

    classList.forEach(c => {
        const exp = expect(inputElement.nativeElement.classList.contains(c));

        if (c === classToBeSet) {
        exp.toBeTruthy(`should contain ${c} css class`);
        } else {
        exp.toBeFalsy(`should not contain ${c} css class`);
        }

    });
}
