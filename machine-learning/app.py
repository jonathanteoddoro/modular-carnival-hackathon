from fastapi import FastAPI
import pandas as pd
import joblib
from preprocessing import preprocess_data

app = FastAPI()

from pydantic import BaseModel

class CompraVendaInput(BaseModel):
    compra: float
    venda: float
    farmacia: str
    medicamento: str
    ano_mes: str

# Carregar modelo e features na inicialização da API
modelo_carregado = joblib.load('model/modelo_fraude.pkl')
features = joblib.load('model/features.pkl')
df_historico = pd.read_csv('data/dados_farmacia.csv')

@app.post("/prever_fraude/")
def prever_fraude(dados: CompraVendaInput):
    compra = dados.compra
    venda = dados.venda
    farmacia = dados.farmacia
    medicamento = dados.medicamento
    ano_mes = dados.ano_mes
    print(compra, venda, farmacia, medicamento, ano_mes)
    
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
    novo_registro_processado = novo_registro_processado[features]

    # Fazer previsão
    predicao = modelo_carregado.predict(novo_registro_processado)
    
    return {"resultado": "Fraude" if predicao[0] == 1 else "Não é fraude"}
