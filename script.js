// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Main elements
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const formulaContent = document.getElementById('formula-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    const calculatorPanels = document.querySelectorAll('.calculator-panel');
    
    // Calculator state
    let currentValue = '0';
    let previousValue = '';
    let currentOperator = null;
    let shouldResetDisplay = false;
    let memoryValue = 0;
    let isInRadianMode = true;
    
    // Initialize the calculator
    initializeCalculator();
    
    // Initialize unit converter
    initializeUnitConverter();
    
    // Tab switching functionality
    function initializeCalculator() {
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active panel
                calculatorPanels.forEach(panel => panel.classList.remove('active'));
                
                // Show the corresponding panel
                if (tabName === 'basic') {
                    document.getElementById('basic-panel').classList.add('active');
                } else if (tabName === 'scientific') {
                    document.getElementById('scientific-panel').classList.add('active');
                } else if (tabName === 'engineering') {
                    document.getElementById('engineering-panel').classList.add('active');
                } else if (tabName === 'unit-converter') {
                    document.getElementById('unit-converter-panel').classList.add('active');
                }
            });
        });
        
        // Add event listeners for all buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                const number = button.getAttribute('data-num');
                
                if (number) {
                    inputNumber(number);
                } else if (action) {
                    performAction(action);
                }
            });
        });
        
        // Add keyboard support
        document.addEventListener('keydown', handleKeyboardInput);
    }
    
    // Handle number input
    function inputNumber(number) {
        if (shouldResetDisplay) {
            currentValue = number;
            shouldResetDisplay = false;
        } else {
            currentValue = currentValue === '0' ? number : currentValue + number;
        }
        updateDisplay();
    }
    
    // Handle decimal point
    function inputDecimal() {
        if (shouldResetDisplay) {
            currentValue = '0.';
            shouldResetDisplay = false;
        } else if (!currentValue.includes('.')) {
            currentValue += '.';
        }
        updateDisplay();
    }
    
    // Handle operators
    function handleOperator(operator) {
        const inputValue = parseFloat(currentValue);
        
        if (previousValue === '') {
            previousValue = currentValue;
        } else if (currentOperator) {
            const result = calculate(parseFloat(previousValue), inputValue, currentOperator);
            previousValue = result.toString();
            history.textContent = `${previousValue} ${getOperatorSymbol(operator)}`;
        }
        
        shouldResetDisplay = true;
        currentOperator = operator;
        updateDisplay();
    }
    
    // Calculate result
    function calculate(first, second, operator) {
        switch (operator) {
            case 'add':
                return first + second;
            case 'subtract':
                return first - second;
            case 'multiply':
                return first * second;
            case 'divide':
                return first / second;
            default:
                return second;
        }
    }
    
    // Get operator symbol for display
    function getOperatorSymbol(operator) {
        switch (operator) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
    
    // Perform calculator actions
    function performAction(action) {
        switch (action) {
            case 'clear':
                clearCalculator();
                break;
            case 'backspace':
                backspace();
                break;
            case 'decimal':
                inputDecimal();
                break;
            case 'percent':
                percent();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                handleOperator(action);
                break;
            case 'calculate':
                calculateResult();
                break;
            case 'sin':
                trigFunction(Math.sin);
                break;
            case 'cos':
                trigFunction(Math.cos);
                break;
            case 'tan':
                trigFunction(Math.tan);
                break;
            case 'asin':
                trigFunction(Math.asin);
                break;
            case 'acos':
                trigFunction(Math.acos);
                break;
            case 'atan':
                trigFunction(Math.atan);
                break;
            case 'log':
                applyFunction(Math.log10, 'log');
                break;
            case 'ln':
                applyFunction(Math.log, 'ln');
                break;
            case 'sqrt':
                applyFunction(Math.sqrt, '√');
                break;
            case 'power':
                handleOperator('power');
                break;
            case 'exp':
                applyFunction(x => Math.exp(x), 'exp');
                break;
            case 'pi':
                currentValue = Math.PI.toString();
                updateDisplay();
                break;
            case 'e':
                currentValue = Math.E.toString();
                updateDisplay();
                break;
            // Engineering functions
            case 'ohmsLaw':
                showFormulaInfo('ohmsLaw');
                break;
            case 'powerCalc':
                showFormulaInfo('powerCalc');
                break;
            case 'resonance':
                showFormulaInfo('resonance');
                break;
            case 'decibel':
                showFormulaInfo('decibel');
                break;
            case 'stress':
                showFormulaInfo('stress');
                break;
            case 'strain':
                showFormulaInfo('strain');
                break;
            case 'torque':
                showFormulaInfo('torque');
                break;
            case 'force':
                showFormulaInfo('force');
                break;
            case 'pressure':
                showFormulaInfo('pressure');
                break;
            case 'efficiency':
                showFormulaInfo('efficiency');
                break;
            case 'scientific':
                handleScientificNotation();
                break;
        }
    }
    
    // Clear calculator
    function clearCalculator() {
        currentValue = '0';
        previousValue = '';
        currentOperator = null;
        history.textContent = '';
        updateDisplay();
    }
    
    // Backspace function
    function backspace() {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
        updateDisplay();
    }
    
    // Percent function
    function percent() {
        const value = parseFloat(currentValue);
        currentValue = (value / 100).toString();
        updateDisplay();
    }
    
    // Calculate final result
    function calculateResult() {
        if (!currentOperator || previousValue === '') return;
        
        const inputValue = parseFloat(currentValue);
        const prevValue = parseFloat(previousValue);
        
        let result;
        if (currentOperator === 'power') {
            result = Math.pow(prevValue, inputValue);
        } else {
            result = calculate(prevValue, inputValue, currentOperator);
        }
        
        history.textContent = `${previousValue} ${getOperatorSymbol(currentOperator)} ${currentValue} =`;
        currentValue = formatResult(result);
        previousValue = '';
        currentOperator = null;
        updateDisplay();
    }
    
    // Apply trigonometric functions
    function trigFunction(func) {
        const value = parseFloat(currentValue);
        let result;
        
        if (isInRadianMode) {
            result = func(value);
        } else {
            // Convert degrees to radians for sin, cos, tan
            if (func === Math.sin || func === Math.cos || func === Math.tan) {
                result = func(value * Math.PI / 180);
            } 
            // Convert radians to degrees for asin, acos, atan
            else {
                result = func(value) * 180 / Math.PI;
            }
        }
        
        currentValue = formatResult(result);
        updateDisplay();
    }
    
    // Apply mathematical function
    function applyFunction(func, name) {
        const value = parseFloat(currentValue);
        try {
            const result = func(value);
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid input');
            }
            history.textContent = `${name}(${value})`;
            currentValue = formatResult(result);
        } catch (error) {
            currentValue = 'Error';
        }
        updateDisplay();
    }
    
    // Handle scientific notation
    function handleScientificNotation() {
        const value = parseFloat(currentValue);
        currentValue = value.toExponential();
        updateDisplay();
    }
    
    // Format result to prevent extremely long numbers
    function formatResult(result) {
        if (Math.abs(result) < 1e-10 && result !== 0) {
            return result.toExponential(10);
        }
        
        if (Math.abs(result) > 1e10) {
            return result.toExponential(10);
        }
        
        // Check if it's close to an integer
        if (Math.abs(result - Math.round(result)) < 1e-10) {
            return Math.round(result).toString();
        }
        
        // Limit decimal places
        return result.toString().includes('.') ? 
            parseFloat(result.toFixed(10)).toString() : 
            result.toString();
    }
    
    // Update display
    function updateDisplay() {
        display.textContent = currentValue;
    }
    
    // Handle keyboard input
    function handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') {
            inputNumber(e.key);
        } else if (e.key === '.') {
            inputDecimal();
        } else if (e.key === '+') {
            handleOperator('add');
        } else if (e.key === '-') {
            handleOperator('subtract');
        } else if (e.key === '*') {
            handleOperator('multiply');
        } else if (e.key === '/') {
            handleOperator('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            calculateResult();
        } else if (e.key === 'Escape') {
            clearCalculator();
        } else if (e.key === 'Backspace') {
            backspace();
        } else if (e.key === '%') {
            percent();
        }
    }
    
    // Show formula information
    function showFormulaInfo(formula) {
        switch (formula) {
            case 'ohmsLaw':
                formulaContent.innerHTML = `
                    <h3>Ohm's Law</h3>
                    <p>V = I × R</p>
                    <p>Where:</p>
                    <ul>
                        <li>V = Voltage (volts)</li>
                        <li>I = Current (amperes)</li>
                        <li>R = Resistance (ohms)</li>
                    </ul>
                    <p>Variations:</p>
                    <ul>
                        <li>I = V ÷ R</li>
                        <li>R = V ÷ I</li>
                    </ul>
                `;
                break;
            case 'powerCalc':
                formulaContent.innerHTML = `
                    <h3>Electrical Power</h3>
                    <p>P = V × I</p>
                    <p>Where:</p>
                    <ul>
                        <li>P = Power (watts)</li>
                        <li>V = Voltage (volts)</li>
                        <li>I = Current (amperes)</li>
                    </ul>
                    <p>Variations:</p>
                    <ul>
                        <li>P = I² × R</li>
                        <li>P = V² ÷ R</li>
                    </ul>
                `;
                break;
            case 'resonance':
                formulaContent.innerHTML = `
                    <h3>Resonant Frequency</h3>
                    <p>f = 1 ÷ (2π√(LC))</p>
                    <p>Where:</p>
                    <ul>
                        <li>f = Resonant frequency (Hz)</li>
                        <li>L = Inductance (henries)</li>
                        <li>C = Capacitance (farads)</li>
                    </ul>
                `;
                break;
            case 'decibel':
                formulaContent.innerHTML = `
                    <h3>Decibel Calculation</h3>
                    <p>dB = 10 × log₁₀(P₂/P₁)</p>
                    <p>Where:</p>
                    <ul>
                        <li>dB = Decibel gain</li>
                        <li>P₂ = Output power</li>
                        <li>P₁ = Input power</li>
                    </ul>
                    <p>For voltage or current:</p>
                    <p>dB = 20 × log₁₀(V₂/V₁)</p>
                `;
                break;
            case 'stress':
                formulaContent.innerHTML = `
                    <h3>Mechanical Stress</h3>
                    <p>σ = F ÷ A</p>
                    <p>Where:</p>
                    <ul>
                        <li>σ = Stress (pascals, Pa)</li>
                        <li>F = Force (newtons, N)</li>
                        <li>A = Area (square meters, m²)</li>
                    </ul>
                `;
                break;
            case 'strain':
                formulaContent.innerHTML = `
                    <h3>Mechanical Strain</h3>
                    <p>ε = ΔL ÷ L</p>
                    <p>Where:</p>
                    <ul>
                        <li>ε = Strain (dimensionless)</li>
                        <li>ΔL = Change in length</li>
                        <li>L = Original length</li>
                    </ul>
                `;
                break;
            case 'torque':
                formulaContent.innerHTML = `
                    <h3>Torque</h3>
                    <p>τ = F × r × sin(θ)</p>
                    <p>Where:</p>
                    <ul>
                        <li>τ = Torque (newton-meters, N·m)</li>
                        <li>F = Force (newtons, N)</li>
                        <li>r = Radius/distance (meters, m)</li>
                        <li>θ = Angle between force and radius vectors</li>
                    </ul>
                `;
                break;
            case 'force':
                formulaContent.innerHTML = `
                    <h3>Force (Newton's Second Law)</h3>
                    <p>F = m × a</p>
                    <p>Where:</p>
                    <ul>
                        <li>F = Force (newtons, N)</li>
                        <li>m = Mass (kilograms, kg)</li>
                        <li>a = Acceleration (meters per second squared, m/s²)</li>
                    </ul>
                `;
                break;
            case 'pressure':
                formulaContent.innerHTML = `
                    <h3>Pressure</h3>
                    <p>P = F ÷ A</p>
                    <p>Where:</p>
                    <ul>
                        <li>P = Pressure (pascals, Pa)</li>
                        <li>F = Force (newtons, N)</li>
                        <li>A = Area (square meters, m²)</li>
                    </ul>
                `;
                break;
            case 'efficiency':
                formulaContent.innerHTML = `
                    <h3>Efficiency</h3>
                    <p>η = (P_out ÷ P_in) × 100%</p>
                    <p>Where:</p>
                    <ul>
                        <li>η = Efficiency (%)</li>
                        <li>P_out = Output power/energy</li>
                        <li>P_in = Input power/energy</li>
                    </ul>
                `;
                break;
            default:
                formulaContent.textContent = 'Select an engineering calculation to see the formula';
        }
    }
    
    // Unit Converter Functionality
    function initializeUnitConverter() {
        const conversionType = document.getElementById('conversion-type');
        const fromUnit = document.getElementById('from-unit');
        const toUnit = document.getElementById('to-unit');
        const fromValue = document.getElementById('from-value');
        const toValue = document.getElementById('to-value');
        const convertButton = document.getElementById('convert-button');
        const swapButton = document.getElementById('swap-units');
        
        // Unit conversion data
        const unitData = {
            length: {
                units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
                conversions: {
                    meter: 1,
                    kilometer: 1000,
                    centimeter: 0.01,
                    millimeter: 0.001,
                    mile: 1609.34,
                    yard: 0.9144,
                    foot: 0.3048,
                    inch: 0.0254
                }
            },
            mass: {
                units: ['kilogram', 'gram', 'milligram', 'metric ton', 'pound', 'ounce'],
                conversions: {
                    kilogram: 1,
                    gram: 0.001,
                    milligram: 0.000001,
                    'metric ton': 1000,
                    pound: 0.453592,
                    ounce: 0.0283495
                }
            },
            temperature: {
                units: ['celsius', 'fahrenheit', 'kelvin'],
                // Special case - handled separately
            },
            area: {
                units: ['square meter', 'square kilometer', 'square centimeter', 'square millimeter', 'square mile', 'square yard', 'square foot', 'square inch', 'hectare', 'acre'],
                conversions: {
                    'square meter': 1,
                    'square kilometer': 1000000,
                    'square centimeter': 0.0001,
                    'square millimeter': 0.000001,
                    'square mile': 2589988.11,
                    'square yard': 0.836127,
                    'square foot': 0.092903,
                    'square inch': 0.00064516,
                    'hectare': 10000,
                    'acre': 4046.86
                }
            },
            volume: {
                units: ['cubic meter', 'cubic centimeter', 'liter', 'milliliter', 'gallon (US)', 'quart (US)', 'pint (US)', 'cup (US)', 'fluid ounce (US)', 'cubic inch', 'cubic foot'],
                conversions: {
                    'cubic meter': 1,
                    'cubic centimeter': 0.000001,
                    'liter': 0.001,
                    'milliliter': 0.000001,
                    'gallon (US)': 0.00378541,
                    'quart (US)': 0.000946353,
                    'pint (US)': 0.000473176,
                    'cup (US)': 0.000236588,
                    'fluid ounce (US)': 0.0000295735,
                    'cubic inch': 0.0000163871,
                    'cubic foot': 0.0283168
                }
            },
            pressure: {
                units: ['pascal', 'kilopascal', 'bar', 'psi', 'atmosphere', 'torr', 'millimeter of mercury'],
                conversions: {
                    'pascal': 1,
                    'kilopascal': 1000,
                    'bar': 100000,
                    'psi': 6894.76,
                    'atmosphere': 101325,
                    'torr': 133.322,
                    'millimeter of mercury': 133.322
                }
            },
            energy: {
                units: ['joule', 'kilojoule', 'calorie', 'kilocalorie', 'watt-hour', 'kilowatt-hour', 'electronvolt', 'british thermal unit'],
                conversions: {
                    'joule': 1,
                    'kilojoule': 1000,
                    'calorie': 4.184,
                    'kilocalorie': 4184,
                    'watt-hour': 3600,
                    'kilowatt-hour': 3600000,
                    'electronvolt': 1.602176634e-19,
                    'british thermal unit': 1055.06
                }
            },
            power: {
                units: ['watt', 'kilowatt', 'megawatt', 'horsepower'],
                conversions: {
                    'watt': 1,
                    'kilowatt': 1000,
                    'megawatt': 1000000,
                    'horsepower': 745.7
                }
            },
            frequency: {
                units: ['hertz', 'kilohertz', 'megahertz', 'gigahertz'],
                conversions: {
                    'hertz': 1,
                    'kilohertz': 1000,
                    'megahertz': 1000000,
                    'gigahertz': 1000000000
                }
            }
        };
        
        // Initialize unit converter
        populateUnitDropdowns();
        
        // Event listeners
        conversionType.addEventListener('change', populateUnitDropdowns);
        convertButton.addEventListener('click', convertUnits);
        swapButton.addEventListener('click', swapUnits);
        
        // Populate unit dropdowns based on selected conversion type
        function populateUnitDropdowns() {
            const type = conversionType.value;
            const units = unitData[type].units;
            
            // Clear existing options
            fromUnit.innerHTML = '';
            toUnit.innerHTML = '';
            
            // Add new options
            units.forEach(unit => {
                fromUnit.add(new Option(unit, unit));
                toUnit.add(new Option(unit, unit));
            });
            
            // Set default "to" unit to something different than "from" unit
            if (units.length > 1) {
                toUnit.selectedIndex = 1;
            }
        }
        
        // Convert units
        function convertUnits() {
            const type = conversionType.value;
            const from = fromUnit.value;
            const to = toUnit.value;
            const value = parseFloat(fromValue.value);
            
            if (isNaN(value)) {
                toValue.value = '';
                return;
            }
            
            let result;
            
            // Special case for temperature
            if (type === 'temperature') {
                result = convertTemperature(value, from, to);
            } else {
                // Standard conversion using ratios
                const fromFactor = unitData[type].conversions[from];
                const toFactor = unitData[type].conversions[to];
                result = (value * fromFactor) / toFactor;
            }
            
            toValue.value = formatResult(result);
        }
        
        // Temperature conversion (special case)
        function convertTemperature(value, from, to) {
            let celsius;
            
            // Convert to Celsius first
            switch (from) {
                case 'celsius':
                    celsius = value;
                    break;
                case 'fahrenheit':
                    celsius = (value - 32) * 5/9;
                    break;
                case 'kelvin':
                    celsius = value - 273.15;
                    break;
            }
            
            // Convert from Celsius to target unit
            switch (to) {
                case 'celsius':
                    return celsius;
                case 'fahrenheit':
                    return (celsius * 9/5) + 32;
                case 'kelvin':
                    return celsius + 273.15;
            }
        }
        
        // Swap units
        function swapUnits() {
            const tempUnit = fromUnit.value;
            const tempValue = fromValue.value;
            
            fromUnit.value = toUnit.value;
            toUnit.value = tempUnit;
            
            fromValue.value = toValue.value;
            toValue.value = tempValue;
            
            // If there's a value, convert it
            if (fromValue.value) {
                convertUnits();
            }
        }
    }
});
