import pandas as pd
import joblib
from preprocessing import preprocess_data

def prever_fraude(compra, venda, farmacia, medicamento, ano_mes, df_historico):
    # Criar um novo registro com os dados fornecidos
    novo_registro = pd.DataFrame({
        'Farmácia': [farmacia],
        'Medicamento': [medicamento],
        'ano_mes': [ano_mes],
        'Compra': [compra],
        'Venda': [venda]
    })

    # Concatenar com o histórico para calcular os atributos corretamente
    df_input = pd.concat([df_historico, novo_registro], ignore_index=True)
    df_input_processado = preprocess_data(df_input)

    # Selecionar apenas a última linha correspondente ao novo dado
    novo_registro_processado = df_input_processado[df_input_processado['ano_mes'] == ano_mes].tail(1)

    # Carregar o modelo treinado e as features
    modelo_carregado = joblib.load('model/modelo_fraude.pkl')
    features = joblib.load('model/features.pkl')

    # Selecionar apenas as features relevantes
    novo_registro_processado = novo_registro_processado[features]

    # Fazer previsão
    predicao = modelo_carregado.predict(novo_registro_processado)
    
    return "Fraude" if predicao[0] == 1 else "Não é fraude"

if __name__ == "__main__":
    df_historico = pd.read_csv('data/dados_farmacia.csv')

    compra_nova = 100
    venda_nova = 200
    farmacia_nova = 'Farma08'
    medicamento_novo = 'Diclofenaco'
    ano_mes_novo = '2025-02'

    resultado = prever_fraude(compra_nova, venda_nova, farmacia_nova, medicamento_novo, ano_mes_novo, df_historico)
    print("Resultado da previsão para o novo registro:", resultado)
