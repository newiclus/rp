class Calculadora(object):
    """My Calculadora"""
    def __init__(self, num1, num2):
        self.a = num1
        self.b = num2

    def sumar(self):
        suma = self.a + self.b
        return suma

valor = Calculadora(7,3)
print valor.sumar()
        