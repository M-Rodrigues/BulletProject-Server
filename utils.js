module.exports = {
    build_data: (dia, mes, ano) => {
        let data = ""
        
        if (!dia) data += "00"
        else if (dia < 10) data += "0" + dia
        else data += dia
    
        if (!mes) data += "00"
        else if (mes < 10) data += "0" + mes
        else data += mes
    
        if (!ano) data = data + "0000"
        else data += ano
    
        return data
    }
}