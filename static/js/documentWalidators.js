document.addEventListener('DOMContentLoaded', function() {
    const documentNumber = document.querySelector('.document-number-input');
    const form = document.querySelector('.form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const { value } = documentNumber;
        const { documentType, isValid } = validateDocumentNumber(value);
        if (isValid) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '');
            let cookies = parse_cookies();
            xhr.setRequestHeader('X-CSRFToken', cookies['csrftoken']);
            xhr.send([
                JSON.stringify({
                    type: documentType,
                    number: value,
                }),
            ]);
            xhr.addEventListener('load', function(e) {
                data = JSON.parse(this.responseText);

                if(this.status != 200){
                    alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
                    return;
                } else {
                    const queryResult = document.querySelector('.query-result');
                    queryResult.classList.remove('query-result-hidden')
                    document.querySelector('.query-table-cell-type').innerHTML = data['document_type']
                    document.querySelector('.query-table-cell-number').innerHTML = data['document_number']
                    document.querySelector('.query-table-cell-is-msp').innerHTML = data['is_msp']
                    createTableRow(data)
                }
            });
        } else {
            alert('Введеная строка не может ИНН или ОГРН');
        }
    });
});

function createTableRow(data) {
    if (data.is_from_cache) return

    const row = document.createElement('tr')
    row.classList.add('query-table-row')

    const typeColumn = document.createElement('td')
    typeColumn.innerText = data.document_type

    const numberColumn = document.createElement('td')
    numberColumn.innerText = data.document_number

    const isMSPColumn = document.createElement('td')
    isMSPColumn.innerText = data.is_msp

    row.appendChild(typeColumn)
    row.appendChild(numberColumn)
    row.appendChild(isMSPColumn)
    document.querySelector('.query-table-body').prepend(row)
}

function validateDocumentNumber(number) {
    const outputForInvalidNumber = { documentType: null, isValid: false }
    if (isNaN(number)){
        return outputForInvalidNumber
    }
    switch (number.length) {
        case 10:
        case 12:
            return { documentType: 'INN', isValid: isInnValid(number) };
        case 13:
            return { documentType: 'OGRN', isValid: isOgrnValid(number)};
        case 15:
            return { documentType: 'OGRN', isValid: isOgrnipValid(number)}
        default:
            return outputForInvalidNumber;
    }
}


function isInnValid(inn) {
    let checkDigit = function (inn, coefficients) {
        let n = 0;
        for (let coefficient in coefficients) {
            n += coefficients[coefficient] * inn[coefficient];
        }
        return parseInt(n % 11 % 10);
    };
    switch (inn.length) {
        case 10:
            let n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
            if (n10 === parseInt(inn[9])) {
                return true
            }
        case 12:
            let n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
            let n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
            if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
                return true
            }
    }
    return false
}


function isOgrnValid(ogrn) {
    let n13 = parseInt((parseInt(ogrn.slice(0, -1)) % 11).toString().slice(-1));
    if (n13 === parseInt(ogrn[12])) {
        return true
    } else {
        return false
    }
}

function isOgrnipValid(ogrnip) {
    let n15 = parseInt((parseInt(ogrnip.slice(0, -1)) % 13).toString().slice(-1));
    if (n15 === parseInt(ogrnip[14])) {
        return true;
    } else {
        return false;
    }
}


function parse_cookies() {
    let cookies = {};
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(function (c) {
            let m = c.trim().match(/(\w+)=(.*)/);
            if (m !== undefined) {
                cookies[m[1]] = decodeURIComponent(m[2]);
            }
        });
    }
    return cookies;
}