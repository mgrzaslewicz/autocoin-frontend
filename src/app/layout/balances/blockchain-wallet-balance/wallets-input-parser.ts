import {Injectable} from '@angular/core';
import {AddBlockchainWalletRequestDto} from "../../../services/balance-monitor.service";


@Injectable()
export class WalletsInputParser {

    linesToDto(currency: string, multiLineString: string): Array<AddBlockchainWalletRequestDto> {
        if (multiLineString == undefined) {
            return [];
        }
        const lines = multiLineString.split('\n');
        return lines
            .filter((it) => it.length > 1)
            .map((it) => {
                const walletAndDescription = it.split(',');
                const walletAddress = walletAndDescription[0].trim();
                let description: string = null;
                if (walletAndDescription.length == 2) {
                    const tmpDescription = walletAndDescription[1].trim();
                    if (tmpDescription.length > 0) {
                        description = tmpDescription;
                    }
                }
                if (walletAddress.length > 1) {
                    return {
                        currency: currency,
                        description: description,
                        walletAddress: walletAddress
                    } as AddBlockchainWalletRequestDto;
                } else {
                    return null;
                }
            })
            .filter((it) => it !== null);
    }
}
