import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, Trash2, Edit, Save, X, CheckCircle, Settings, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import 'bootstrap/dist/css/bootstrap.min.css';

// Definición de tipos
/**
 * @typedef {object} IncompleteBag
 * @property {string} id
 * @property {string[]} ingredients
 * @property {number} ingredientCount
 * @property {number} quantity
 */

// Constantes para los ingredientes
const ALL_INGREDIENTS = [
    { value: 'pollo', label: 'Pollo' },
    { value: 'higado', label: 'Hígado' },
    { value: 'rinon', label: 'Riñón' },
    { value: 'corazon', label: 'Corazón' },
    { value: 'pescado', label: 'Pescado' },
    { value: 'carneMolida', label: 'Carne Molida' },
];

const MAX_INGREDIENTS_PER_BAG = 4;

// Valores por defecto de gramos por porción.
const DEFAULT_GRAMS_PER_PORTION = {
    pollo: 132,
    pescado: 83,
    corazon: 45,
    higado: 49,
    rinon: 49,
    carneMolida: 83,
};

// Componente para mostrar mensajes (Toast)
const Toast = ({ message, type, onClose }) => {
    let icon;
    let colorClass = 'bg-primary text-white'; // Default
    switch (type) {
        case 'success':
            icon = <CheckCircle className="h-4 w-4" />;
            colorClass = 'bg-success text-white';
            break;
        case 'error':
            icon = <AlertTriangle className="h-4 w-4" />;
            colorClass = 'bg-danger text-white';
            break;
        case 'info':
        default:
            icon = <CheckCircle className="h-4 w-4" />; // Usar CheckCircle para info también si es una actualización
            colorClass = 'bg-info text-white';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-3 rounded shadow-lg d-flex align-items-center gap-2 ${colorClass}`}
        >
            {icon}
            <span className="text-sm">{message}</span>
            <button onClick={onClose} className="ml-2 text-xs text-white opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

// Componente para la tarjeta de bolsa incompleta
const IncompleteBagCard = ({ bag, onEdit, onDelete, onComplete }) => {
    const ALL_INGREDIENTS_MAP = new Map(ALL_INGREDIENTS.map(i => [i.value, i.label]));
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="card mb-3"
        >
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <p className="card-text small">
                        Bolsa ({bag.ingredientCount} ingrediente{bag.ingredientCount !== 1 ? 's' : ''}) - Cantidad: {bag.quantity}
                    </p>
                    <p className="card-subtitle text-muted small">
                        Ingredientes: {bag.ingredients.map(ing => ALL_INGREDIENTS_MAP.get(ing) || 'Desconocido').join(', ')}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => onComplete(bag.id)}
                        title="Completar Bolsa"
                        className="btn btn-outline-success btn-sm"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onEdit(bag.id)}
                        title="Editar Bolsa"
                        className="btn btn-outline-primary btn-sm"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(bag.id)}
                        title="Eliminar Bolsa"
                        className="btn btn-outline-danger btn-sm"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Componente para el formulario de agregar/editar bolsa incompleta
const IncompleteBagForm = ({ ingredients: selectedIngredients, quantity: bagQuantity, onIngredientToggle, onSave, onCancel, isEditing }) => {
    const [quantity, setQuantity] = useState(bagQuantity);

    useEffect(() => {
        setQuantity(bagQuantity);
    }, [bagQuantity]);

    const handleSave = () => {
        onSave(quantity);
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded shadow-md"
        >
            <h3 className="h5 font-semibold">{isEditing ? 'Editar Bolsa Incompleta' : 'Agregar Bolsa Incompleta'}</h3>
            <div className="row g-2">
                {ALL_INGREDIENTS.map(ingredient => (
                    <div className="col-6 col-md-4" key={ingredient.value}>
                        <button
                            type="button"
                            className={`btn w-100 ${selectedIngredients.includes(ingredient.value) ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => onIngredientToggle(ingredient.value)}
                        >
                            {ingredient.label}
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-3">
                <label htmlFor="quantity" className="form-label">Cantidad</label>
                <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="form-control w-auto"
                />
            </div>
            <div className="mt-4 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={selectedIngredients.length === 0 || quantity <= 0 || selectedIngredients.length > 4} //añadido control de cantidad
                >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                </button>
            </div>
        </motion.div>
    );
};

// Componente principal de la aplicación
const BarfInventoryApp = () => {
    const [completeBags, setCompleteBags] = useState(0);
    const [incompleteBags, setIncompleteBags] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingBagId, setEditingBagId] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    const [quantity, setQuantity] = useState(1);
    const [gramsPerPortion, setGramsPerPortion] = useState(DEFAULT_GRAMS_PER_PORTION);
    const [editingGrams, setEditingGrams] = useState(false);

    // Nuevo estado para la marca de tiempo de la última actualización
    const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());

    // Función para mostrar un toast
    const showMessage = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 6000); // 6 segundos para mensajes automáticos
    };

    // Carga inicial y lógica de descuento automático
    useEffect(() => {
        const savedCompleteBags = localStorage.getItem('completeBags');
        const savedIncompleteBags = localStorage.getItem('incompleteBags');
        const savedGramsPerPortion = localStorage.getItem('gramsPerPortion');
        const savedLastUpdateTimestamp = localStorage.getItem('lastUpdateTimestamp');

        let initialCompleteBags = 0;
        if (savedCompleteBags) {
            initialCompleteBags = parseInt(savedCompleteBags, 10);
        }

        // --- Lógica de Descuento Automático ---
        if (savedLastUpdateTimestamp) {
            const lastTime = parseInt(savedLastUpdateTimestamp, 10);

            // Milliseconds in one day
            const msPerDay = 24 * 60 * 60 * 1000;

            // Normalizar fechas a medianoche (00:00:00) para calcular días completos
            const startOfToday = new Date().setHours(0, 0, 0, 0);
            const startOfLastUpdateDay = new Date(lastTime).setHours(0, 0, 0, 0);

            // Calcular días completos transcurridos
            const daysPassed = Math.floor((startOfToday - startOfLastUpdateDay) / msPerDay);

            if (daysPassed > 0) {
                const deduction = daysPassed * 2; // 2 bolsas por día
                const newCompleteBags = Math.max(0, initialCompleteBags - deduction);

                if (newCompleteBags < initialCompleteBags) {
                    const bagsDeducted = initialCompleteBags - newCompleteBags;
                    showMessage(
                        `Descuento automático: Se descontaron ${bagsDeducted} bolsas (Comida de ${daysPassed} día(s)). Nuevo inventario: ${newCompleteBags}`,
                        'info'
                    );
                    initialCompleteBags = newCompleteBags;
                }
            }
        }

        // Cargar bolsas incompletas
        if (savedIncompleteBags) {
            try {
                const parsedBags = JSON.parse(savedIncompleteBags);
                if (Array.isArray(parsedBags) && parsedBags.every(bag =>
                    typeof bag === 'object' &&
                    typeof bag.id === 'string' &&
                    Array.isArray(bag.ingredients) &&
                    bag.ingredients.every(ing => typeof ing === 'string') &&
                    typeof bag.ingredientCount === 'number' &&
                    typeof bag.quantity === 'number'
                )) {
                    setIncompleteBags(parsedBags);
                } else {
                    console.error('Invalid data structure in localStorage for incompleteBags');
                    setIncompleteBags([]);
                }
            } catch (error) {
                console.error('Error parsing incompleteBags from localStorage:', error);
                setIncompleteBags([]);
            }
        }

        // Cargar gramos por porción
        if (savedGramsPerPortion) {
            try {
                setGramsPerPortion(JSON.parse(savedGramsPerPortion));
            } catch (error) {
                console.error("Error parsing gramsPerPortion", error);
                setGramsPerPortion(DEFAULT_GRAMS_PER_PORTION);
            }
        }

        // Establecer el nuevo inventario y la marca de tiempo (incluso si no hay descuento)
        setCompleteBags(initialCompleteBags);
        setLastUpdateTimestamp(Date.now());

    }, []);

    // Guardar en localStorage cuando cambian los datos
    useEffect(() => {
        localStorage.setItem('completeBags', completeBags.toString());
        localStorage.setItem('incompleteBags', JSON.stringify(incompleteBags));
        localStorage.setItem('gramsPerPortion', JSON.stringify(gramsPerPortion));
        // Guardar la marca de tiempo cada vez que se actualiza cualquier estado persistente
        localStorage.setItem('lastUpdateTimestamp', lastUpdateTimestamp.toString());
    }, [completeBags, incompleteBags, gramsPerPortion, lastUpdateTimestamp]);


    // Funciones para el inventario completo
    const incrementCompleteBags = () => {
        setCompleteBags(prev => prev + 1);
        setLastUpdateTimestamp(Date.now()); // Actualizar timestamp al hacer un cambio manual
        showMessage('Se agregó una bolsa completa', 'success');
    };

    const decrementCompleteBags = () => {
        if (completeBags > 0) {
            setCompleteBags(prev => prev - 1);
            setLastUpdateTimestamp(Date.now()); // Actualizar timestamp al hacer un cambio manual
            showMessage('Se eliminó una bolsa completa', 'error');
        } else {
            showMessage('No hay bolsas completas para eliminar', 'error');
        }
    };

    // Funciones para el inventario incompleto (Mantienen la lógica de actualizar el timestamp)

    const addIncompleteBag = (bagQuantity) => {
        if (selectedIngredients.length === 0 || selectedIngredients.length > 4 || bagQuantity <= 0) {
            showMessage('Error al agregar la bolsa. Revise ingredientes (1-4) y cantidad (>0)', 'error');
            return;
        }

        const newBag = {
            id: crypto.randomUUID(),
            ingredients: selectedIngredients,
            ingredientCount: selectedIngredients.length,
            quantity: bagQuantity,
        };
        setIncompleteBags([...incompleteBags, newBag]);
        setIsAdding(false);
        setSelectedIngredients([]);
        setQuantity(1);
        setLastUpdateTimestamp(Date.now());
        showMessage('Bolsa incompleta agregada', 'success');
    };

    const startEditingBag = (id) => {
        const bagToEdit = incompleteBags.find(bag => bag.id === id);
        if (bagToEdit) {
            setEditingBagId(id);
            setSelectedIngredients(bagToEdit.ingredients);
            setQuantity(bagToEdit.quantity);
        }
    };

    const saveEditedBag = (id, bagQuantity) => {
        if (selectedIngredients.length === 0 || selectedIngredients.length > 4 || bagQuantity <= 0) {
            showMessage('Error al guardar. Revise ingredientes (1-4) y cantidad (>0)', 'error');
            return;
        }
        setIncompleteBags(incompleteBags.map(bag =>
            bag.id === id
                ? { ...bag, ingredients: selectedIngredients, ingredientCount: selectedIngredients.length, quantity: bagQuantity }
                : bag
        ));
        setEditingBagId(null);
        setSelectedIngredients([]);
        setQuantity(1);
        setLastUpdateTimestamp(Date.now());
        showMessage('Bolsa incompleta editada', 'success');
    };

    const deleteBag = (id) => {
        setIncompleteBags(prevBags => {
            const updatedBags = prevBags.filter(bag => bag.id !== id);
            return updatedBags;
        });
        setLastUpdateTimestamp(Date.now());
        showMessage('Bolsa incompleta eliminada', 'error');
    };

    const completeBag = (id) => {
        setIncompleteBags(prevBags => {
            const bagToComplete = prevBags.find(bag => bag.id === id);
            if (!bagToComplete) return prevBags;

            if (bagToComplete.ingredientCount === 4) {
                setCompleteBags(currentCompleteBags => currentCompleteBags + bagToComplete.quantity);
                const updatedBags = prevBags.filter(bag => bag.id !== id);
                setLastUpdateTimestamp(Date.now());
                showMessage('Bolsa(s) completada(s) y movida(s) a inventario completo', 'success');
                return updatedBags;
            } else {
                showMessage('Faltan ingredientes para completar la bolsa', 'error');
                return prevBags;
            }
        });
    };

    const toggleIngredient = (ingredientValue) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredientValue)
                ? prev.filter(item => item !== ingredientValue)
                : [...prev, ingredientValue]
        );
    };

    // Función para calcular las porciones faltantes
    const calculateMissingIngredients = useCallback(() => {
        const missing = {
            pollo: 0, higado: 0, rinon: 0, corazon: 0, pescado: 0, carneMolida: 0,
        };

        incompleteBags.forEach(bag => {
            const missingIngredientsCount = MAX_INGREDIENTS_PER_BAG - bag.ingredientCount;

            if (missingIngredientsCount > 0) {
                if (!bag.ingredients.includes('pollo')) missing.pollo += bag.quantity;
                if (!bag.ingredients.includes('higado')) missing.higado += bag.quantity;
                if (!bag.ingredients.includes('rinon')) missing.rinon += bag.quantity;
                if (!bag.ingredients.includes('corazon')) missing.corazon += bag.quantity;
                if (!bag.ingredients.includes('pescado')) missing.pescado += bag.quantity;
                if (!bag.ingredients.includes('carneMolida')) missing.carneMolida += bag.quantity;
            }
        });
        return missing;
    }, [incompleteBags]);

    const missingIngredients = calculateMissingIngredients();

    // Función para calcular la cantidad a comprar
    const calculatePurchaseAmounts = useCallback(() => {
        const purchaseAmounts = {};
        for (const ingredient in missingIngredients) {
            const totalGrams = (missingIngredients[ingredient] || 0) * (gramsPerPortion[ingredient] || 0);

            if (totalGrams > 1000) {
                // Convertir a kg con un decimal y redondear hacia arriba (ceil)
                // Math.ceil(1825 / 100) / 10 = Math.ceil(18.25) / 10 = 19 / 10 = 1.9
                // Math.ceil(1235 / 100) / 10 = Math.ceil(12.35) / 10 = 13 / 10 = 1.3
                purchaseAmounts[ingredient] = Math.ceil(totalGrams / 100) / 10;
            } else {
                purchaseAmounts[ingredient] = totalGrams;
            }

        }
        return purchaseAmounts;
    }, [missingIngredients, gramsPerPortion]);

    const purchaseAmounts = calculatePurchaseAmounts();

    const handleGramsChange = (ingredient, value) => {
        setGramsPerPortion(prevGrams => ({
            ...prevGrams,
            [ingredient]: value,
        }));
    };

    const toggleEditingGrams = () => {
        setEditingGrams(prev => !prev);
    };

    // Render
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Inventario BARF
            </h1>

            <div className="row g-4">
                {/* Sección de Bolsas Completas */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white shadow rounded p-4 h-full">
                        <h2 className="h5 mb-2">Bolsas Completas</h2>
                        <p className="text-muted mb-3">Número de bolsas listas</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="h2">{completeBags}</span>
                            <div className="d-flex gap-2">
                                <button
                                    onClick={decrementCompleteBags}
                                    className="btn btn-outline-danger"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={incrementCompleteBags}
                                    className="btn btn-outline-success"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-muted small mt-3">
                            <small>Última actualización de inventario: {new Date(lastUpdateTimestamp).toLocaleDateString()} {new Date(lastUpdateTimestamp).toLocaleTimeString()}</small>
                        </p>
                    </div>
                </div>

                {/* Sección de Bolsas Incompletas */}
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="bg-white shadow rounded p-4 h-full">
                        <h2 className="h5 mb-2">Bolsas Incompletas</h2>
                        <p className="text-muted mb-3">Bolsas con menos de 4 ingredientes</p>
                        <div className="mb-3">
                            {!isAdding && editingBagId === null && (
                                <button
                                    className="btn btn-outline-info d-flex align-items-center"
                                    onClick={() => {
                                        setIsAdding(true);
                                        setSelectedIngredients([]);
                                        setQuantity(1);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Bolsa Incompleta
                                </button>
                            )}
                        </div>

                        <AnimatePresence>
                            {(isAdding || editingBagId !== null) && (
                                <IncompleteBagForm
                                    ingredients={selectedIngredients}
                                    quantity={quantity}
                                    onIngredientToggle={toggleIngredient}
                                    onSave={editingBagId
                                        ? (bagQuantity) => saveEditedBag(editingBagId, bagQuantity)
                                        : (bagQuantity) => addIncompleteBag(bagQuantity)
                                    }
                                    onCancel={() => {
                                        setIsAdding(false);
                                        setEditingBagId(null);
                                        setSelectedIngredients([]);
                                        setQuantity(1);
                                    }}
                                    isEditing={editingBagId !== null}
                                />
                            )}
                        </AnimatePresence>

                        <div className="mt-4">
                            <AnimatePresence>
                                {incompleteBags.map(bag => (
                                    <IncompleteBagCard
                                        key={bag.id}
                                        bag={bag}
                                        onEdit={startEditingBag}
                                        onDelete={deleteBag}
                                        onComplete={completeBag}
                                    />
                                ))}
                            </AnimatePresence>
                            {incompleteBags.length === 0 && !isAdding && editingBagId === null && (
                                <div className="text-muted text-center py-4 border rounded">
                                    No hay bolsas incompletas. ¡Excelente!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección de Cantidad a Comprar */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="bg-white shadow rounded p-4 h-full">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="h5">Cantidad de Ingredientes a Comprar</h2>
                            <button onClick={toggleEditingGrams} className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                                <Settings className="h-4 w-4 mr-1" />
                                {editingGrams ? ' Guardar' : ' Editar'} Cantidades
                            </button>
                        </div>
                        <p className="text-muted mb-3">Cantidad total de cada ingrediente (kg/g):</p>
                        <ul className="list-group">
                            {Object.entries(purchaseAmounts).map(([ingredient, amount]) => (
                                <li key={ingredient} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span><strong>{ALL_INGREDIENTS.find(i => i.value === ingredient)?.label || ingredient}: </strong>
                                        {/* Muestra la cantidad con formato kg o g */}
                                        <span className={`ml-2 font-weight-bold ${amount > 0 ? 'text-primary' : 'text-success'}`}>
                                            {typeof amount === 'number' && amount > 1000 ? `${amount.toFixed(1)} kg` : `${amount} g`}
                                        </span>
                                    </span>
                                    {!editingGrams && <span>{gramsPerPortion[ingredient]} g / porción</span>}
                                </li>
                            ))}
                        </ul>
                        {editingGrams && (
                             <div className="mt-3">
                                <p className="text-muted small">Edite los gramos por porción:</p>
                                <ul className="list-group">
                                    {ALL_INGREDIENTS.map(ing => (
                                        <li key={ing.value} className="list-group-item d-flex justify-content-between align-items-center p-2">
                                            <span>{ing.label}:</span>
                                            <input
                                                type="number"
                                                value={gramsPerPortion[ing.value] || 0}
                                                onChange={(e) => handleGramsChange(ing.value, parseInt(e.target.value, 10))}
                                                className="form-control w-50"
                                                min="0"
                                            />
                                            <span className='ml-1'>g</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted small mt-3">Haga clic en Guardar para actualizar los cálculos.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sección de Ingredientes Faltantes (Movida al lado de Cantidad a Comprar en pantallas grandes) */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white shadow rounded p-4 h-full">
                        <h2 className="h5 mb-2">Porciones Faltantes</h2>
                        <p className="text-muted mb-3"># de porciones necesarias (bolsas incompletas):</p>
                        <ul className="list-group">
                            <li className="list-group-item"><strong>Pollo:</strong> {missingIngredients.pollo} porciones</li>
                            <li className="list-group-item"><strong>Hígado:</strong> {missingIngredients.higado} porciones</li>
                            <li className="list-group-item"><strong>Riñón:</strong> {missingIngredients.rinon} porciones</li>
                            <li className="list-group-item"><strong>Corazón:</strong> {missingIngredients.corazon} porciones</li>
                            <li className="list-group-item"><strong>Pescado:</strong> {missingIngredients.pescado} porciones</li>
                            <li className="list-group-item"><strong>Carne Molida:</strong> {missingIngredients.carneMolida} porciones</li>
                        </ul>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showToast && (
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BarfInventoryApp;