export interface WithMessageDto<T> {
    result?: T;
    infoMessageList?: String[];
    warningMessageList?: String[];
    errorMessageList?: String[];
}
