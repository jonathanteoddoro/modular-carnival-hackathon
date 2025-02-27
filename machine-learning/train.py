import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from preprocessing import preprocess_data

df = pd.read_csv('data/dados_farmacia.csv')
df_processado = preprocess_data(df)
df_model = df_processado.dropna().copy()

features = ['Compra', 'Venda', 'ratio', 'Compra_lag1', 'ratio_lag1',
            'Compra_diff', 'ratio_diff', 'Compra_rolling_mean', 'ratio_rolling_mean']
X = df_model[features]
y = df_model['ÉFraude']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Relatório de Classificação:")
print(classification_report(y_test, y_pred))
print("Matriz de Confusão:")
print(confusion_matrix(y_test, y_pred))

joblib.dump(model, 'model/modelo_fraude.pkl')
joblib.dump(features, 'model/features.pkl')
print("Modelo salvo com sucesso!")
