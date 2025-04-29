# Proyecto creado con Gemini 2.0

Me gustaría automatizar el proceso de inventario que tengo para la alimentación de mi perro, tiene una dieta Barf entonces se le compran todos los ingredientes por aparte y luego se le integran para formar bolsas de comidas. Cada bolsa lleva 4 ingredientes.

Se le compra pollo, hígado, riñón, corazón, pescado y carne molida. Dentro de esos ingredientes hay unos que se intercambian entre ellos, como el hígado y el riñón, y también la carne molida y el pescado.

Actualmente llevamos el inventario manualmente, por ejemplo apuntamos que tenemos 21 bolsitas completas.

Pero también nos quedan bolsas incompletas, algunas con 1 solo ingrediente, otras con dos o tres.

Me gustaría un que automatice eso, puede ser vuejs o react js, que se genere un PWA Para subir a un servidor. Me gustaría que se guarden cuantas bolsas están completas, y la cantidad de cuantas incompletas, y estas incompletas poder agregar una descripción de que ingredientes tienen.

De momento me gustaría que la información se guarde en localstorage pero luego me gustaría guardarlo en sqlite, firebase o mongo. O alguna base de datos en línea.

Sección donde puedas hacer el calculo de la cantidad que deberia de comprar por cada producto ya sea gramos o kilogramos, basado en las porciones faltantes.

Te explico, cada producto lleva una cantidad en gramos, es decir, cada porcion tiene su medida, esto porque recuerda que es una dieta entonces debe ser controlada la cantidad que se come al dia el perro.

Pollo 132 g
Pescado 83 g
Corazon 45 g
Higado 49g
Riñon 49g
Carne molida 83g

De ser posible me gustaria que la cantidad de cada producto sea editable por si en algun momento la dieta cambia, y hubiera que bajarle o subirle a las cantidades de cada producto.


Es posible agregar una seccion nueva, donde yo pueda agregar cuantas porciones necesito y basado en las cantidades de cada producto me diga cuanto es el total a comprar de cada producto. Similar a la anterior pero en esta yo debo digitar la cantidad de porciones de cada producto.