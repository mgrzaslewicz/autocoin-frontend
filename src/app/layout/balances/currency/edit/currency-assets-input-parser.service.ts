import {Injectable} from '@angular/core';
import {AddUserCurrencyAssetRequestDto} from "../../../../services/balance-monitor.service";


@Injectable()
export class CurrencyAssetsInputParser {

    linesToDtos(multiLineString: string): Array<AddUserCurrencyAssetRequestDto> {
        if (multiLineString == undefined) {
            return [];
        }
        const lines = multiLineString.split('\n');
        return lines
            .filter((it) => it.length > 1)
            .map((it) => {
                const currencyBalanceAndDescription = it.split(',');
                const currency = currencyBalanceAndDescription[0].trim();
                const balance = currencyBalanceAndDescription[1]?.trim();
                const description = currencyBalanceAndDescription[2]?.trim() ?? null;
                if (currency.length > 1 && Number(balance) > 0) {
                    return {
                        currency: currency,
                        balance: balance,
                        description: description,
                    } as AddUserCurrencyAssetRequestDto;
                } else {
                    return null;
                }
            })
            .filter((it) => it !== null);
    }
}
