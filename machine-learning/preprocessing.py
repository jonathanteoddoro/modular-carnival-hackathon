import pandas as pd

def preprocess_data(df):
    df = df.sort_values(['Farmácia', 'Medicamento', 'ano_mes']).copy()
    
    df['ratio'] = df['Compra'] / (df['Venda'] + 1e-5)
    
    for lag in [1, 2]:
        df[f'Compra_lag{lag}'] = df.groupby(['Farmácia', 'Medicamento'])['Compra'].shift(lag)
        df[f'ratio_lag{lag}'] = df.groupby(['Farmácia', 'Medicamento'])['ratio'].shift(lag)
    
    df['Compra_diff'] = df['Compra'] - df['Compra_lag1']
    df['ratio_diff'] = df['ratio'] - df['ratio_lag1']
    
    df['Compra_rolling_mean'] = df.groupby(['Farmácia', 'Medicamento'])['Compra']\
                                  .transform(lambda x: x.rolling(window=3, min_periods=1).mean())
    df['ratio_rolling_mean'] = df.groupby(['Farmácia', 'Medicamento'])['ratio']\
                                 .transform(lambda x: x.rolling(window=3, min_periods=1).mean())
    
    return df
