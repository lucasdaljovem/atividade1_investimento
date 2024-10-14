// Função para maximizar o retorno dos investimentos utilizando a abordagem do problema da mochila
function maximizeReturn(budget, costs, returns, numInvestments) {
    // Criação de uma matriz dp para armazenar os resultados parciais
    let dp = new Array(numInvestments + 1);
    for (let i = 0; i <= numInvestments; i++) {
        dp[i] = new Array(budget + 1).fill(0);
    }

    // Matriz para rastrear quais investimentos foram selecionados
    let selected = new Array(numInvestments + 1).fill(0).map(() => new Array(budget + 1).fill(false));

    // Preenchimento da tabela dp usando programação dinâmica
    for (let i = 0; i <= numInvestments; i++) {
        for (let currentBudget = 0; currentBudget <= budget; currentBudget++) {
            // Caso base: sem itens ou orçamento zero
            if (i === 0 || currentBudget === 0) {
                dp[i][currentBudget] = 0;
            } 
            // Se o custo do investimento for menor ou igual ao orçamento atual
            else if (costs[i - 1] <= currentBudget) {
                // Opção 1: incluir o investimento i-1
                let includeItem = returns[i - 1] + dp[i - 1][currentBudget - costs[i - 1]];
                // Opção 2: não incluir o investimento i-1
                let excludeItem = dp[i - 1][currentBudget];

                // Escolha o melhor entre incluir e não incluir
                if (includeItem > excludeItem) {
                    dp[i][currentBudget] = includeItem;
                    selected[i][currentBudget] = true; // Marque que o item foi selecionado
                } else {
                    dp[i][currentBudget] = excludeItem;
                }
            } 
            // Se o custo for maior que o orçamento atual, não pode incluir o item
            else {
                dp[i][currentBudget] = dp[i - 1][currentBudget];
            }
        }
    }

    // Rastrear quais investimentos foram selecionados
    let w = budget;
    let selectedInvestments = [];
    for (let i = numInvestments; i > 0; i--) {
        if (selected[i][w]) {
            selectedInvestments.push(i - 1); // Adicione o investimento à lista de selecionados
            w -= costs[i - 1]; // Subtraia o custo do orçamento restante
        }
    }

    return {
        maxReturn: dp[numInvestments][budget], // Retorno máximo calculado
        selectedInvestments: selectedInvestments.reverse() // Lista de investimentos selecionados
    };
}

// Função para formatar os valores em moeda brasileira (R$)
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função chamada ao clicar no botão "Calcular Retorno Máximo"
function calculateMaxReturn() {
    try {
        // Obtém o orçamento disponível
        let budget = parseInt(document.getElementById('budget').value);

        // Obtém os custos e retornos inseridos pelo usuário
        let costs = [
            parseInt(document.getElementById('cost1').value),
            parseInt(document.getElementById('cost2').value),
            parseInt(document.getElementById('cost3').value),
            parseInt(document.getElementById('cost4').value),
            parseInt(document.getElementById('cost5').value)
        ];

        let returns = [
            parseInt(document.getElementById('return1').value),
            parseInt(document.getElementById('return2').value),
            parseInt(document.getElementById('return3').value),
            parseInt(document.getElementById('return4').value),
            parseInt(document.getElementById('return5').value)
        ];

        // Validação para garantir que todos os valores sejam numéricos
        if (costs.includes(NaN) || returns.includes(NaN)) {
            console.error("Todos os valores de custo e retorno devem ser numéricos.");
            alert("Por favor, insira todos os valores corretamente.");
            return;
        }

        // Chama a função maximizeReturn para obter o retorno máximo e os investimentos selecionados
        let result = maximizeReturn(budget, costs, returns, costs.length);
        let maxReturn = result.maxReturn;
        let selectedInvestments = result.selectedInvestments;

        // Lista de nomes dos investimentos para exibir quais foram selecionados
        let investmentsNames = ["Ações de Empresa X", "Ações de Empresa Y", "Imóvel Z", "Títulos Públicos P", "Fundo de Investimento F"];
        let selectedNames = selectedInvestments.map(index => investmentsNames[index]);

        // Exibe o retorno máximo esperado e os investimentos selecionados no front-end
        document.getElementById('result').innerText = "Retorno máximo esperado: " + formatCurrency(maxReturn);
        document.getElementById('selectedInvestments').innerText = "Investimentos selecionados: " + selectedNames.join(", ");
    } catch (error) {
        console.error("Ocorreu um erro durante o cálculo:", error);
    }
}
