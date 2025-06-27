# -*- coding: utf-8 -*-
def calcular_dv(id_deudor):
    # Validar si hay letras en el id_deudor
    if any(char.isalpha() for char in str(id_deudor)):
        return 0

    coeficientes = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]
    sumatoria = 0
    cnt = 0
    dv = None
    # Convierte número en string y lo itera de atrás hacia adelante
    for digito in str(id_deudor)[::-1]:
        sumatoria += int(digito) * coeficientes[cnt]
        cnt += 1
    residuo = sumatoria % 11
    if residuo > 1:
        dv = 11 - residuo
    else:
        dv = residuo
    return dv


def validar_dv(numero, dv):
    """
    Valida si el número y el dígito de verificación corresponden

    >>> validar(811026552,0)
    False
    >>> validar(890925108,6)
    True
    >>> validar(800197384,1)
    False
    >>> validar(899999034,1)
    True
    >>> validar(8600123361,3)
    False
    >>> validar(899999239,2)
    True
    >>> validar(890900841,7)
    False
    """
    return calcular_dv(numero) == dv

if __name__ == "__main__":
    import doctest
    doctest.testmod()