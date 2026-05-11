<script lang="ts">
  interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }
  
  let tooltip: TooltipState = {
    visible: false,
    x: 0,
    y: 0,
    content: ''
  };
  
  const showTooltip = (event: MouseEvent, content: string) => {
    // Adjust tooltip position to ensure it stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate positions, ensuring tooltip stays in viewport
    let x = event.clientX + 10;
    let y = event.clientY - 10;
    
    // Basic tooltip width/height estimate
    const tooltipWidth = 250;
    const tooltipHeight = 80;
    
    // Adjust if too close to right edge
    if (x + tooltipWidth > viewportWidth - 20) {
      x = event.clientX - tooltipWidth - 10;
    }
    
    // Adjust if too close to bottom edge
    if (y + tooltipHeight > viewportHeight - 20) {
      y = event.clientY - tooltipHeight - 10;
    }
    
    tooltip = {
      visible: true,
      x,
      y,
      content
    };
  };
  
  const hideTooltip = () => {
    tooltip.visible = false;
  };
  
  const descriptions = {
    input: "Input graph data with nodes and edges representing the molecular or network structure",
    scn: "Spectral Convolution Network (SCN) with confGCN and CC (Connected Components) - processes graph structure through spectral domain convolutions with Activation Layer 1 (F)",
    dense1: "First dense layer - fully connected layer that transforms features",
    activation2: "Second activation layer combining c1*f1 + c2*f2 - weighted combination of feature transformations",
    dense2: "Second dense layer - another fully connected transformation",
    activation3: "Third activation layer with same combination formula c1*f1 + c2*f2",
    output: "Final output layer producing the network predictions",
    optimization: "Hyperparameter and training algorithm optimization - automated tuning of model parameters"
  };
</script>

<div class="w-full bg-white p-8 relative">
  <div class="flex items-center justify-between overflow-x-auto pb-4">
    
    <!-- Input Section -->
    <div class="flex flex-col items-center space-y-4 mx-2">
      <div 
        class="w-28 h-28 border-2 border-black rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white relative"
        on:mouseenter={(e) => showTooltip(e, descriptions.input)}
        on:mouseleave={hideTooltip}
      >
        <!-- Graph structure -->
        <svg viewBox="0 0 88 88" class="w-full h-full">
          <!-- Nodes -->
          <circle cx="44" cy="12" r="4" fill="#2563eb"/>
          <circle cx="20" cy="25" r="4" fill="#2563eb"/>
          <circle cx="68" cy="25" r="4" fill="#2563eb"/>
          <circle cx="12" cy="44" r="4" fill="#2563eb"/>
          <circle cx="44" cy="44" r="4" fill="#2563eb"/>
          <circle cx="76" cy="44" r="4" fill="#2563eb"/>
          <circle cx="20" cy="63" r="4" fill="#2563eb"/>
          <circle cx="68" cy="63" r="4" fill="#2563eb"/>
          <circle cx="44" cy="76" r="4" fill="#2563eb"/>
          
          <!-- Edges -->
          <line x1="44" y1="12" x2="20" y2="25" stroke="#2563eb" stroke-width="2"/>
          <line x1="44" y1="12" x2="68" y2="25" stroke="#2563eb" stroke-width="2"/>
          <line x1="20" y1="25" x2="12" y2="44" stroke="#2563eb" stroke-width="2"/>
          <line x1="20" y1="25" x2="44" y2="44" stroke="#2563eb" stroke-width="2"/>
          <line x1="68" y1="25" x2="44" y2="44" stroke="#2563eb" stroke-width="2"/>
          <line x1="68" y1="25" x2="76" y2="44" stroke="#2563eb" stroke-width="2"/>
          <line x1="12" y1="44" x2="20" y2="63" stroke="#2563eb" stroke-width="2"/>
          <line x1="44" y1="44" x2="20" y2="63" stroke="#2563eb" stroke-width="2"/>
          <line x1="44" y1="44" x2="68" y2="63" stroke="#2563eb" stroke-width="2"/>
          <line x1="76" y1="44" x2="68" y2="63" stroke="#2563eb" stroke-width="2"/>
          <line x1="20" y1="63" x2="44" y2="76" stroke="#2563eb" stroke-width="2"/>
          <line x1="68" y1="63" x2="44" y2="76" stroke="#2563eb" stroke-width="2"/>
        </svg>
      </div>
      <div class="text-center font-medium text-black">Input</div>
      
      <!-- Optimization gears -->
      <div 
        class="flex items-center space-x-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        on:mouseenter={(e) => showTooltip(e, descriptions.optimization)}
        on:mouseleave={hideTooltip}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" class="fill-black">
          <path d="M10 2l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3L10 2z"/>
        </svg>
        <svg width="28" height="28" viewBox="0 0 28 28" class="fill-black">
          <circle cx="14" cy="14" r="12" stroke="black" stroke-width="2" fill="white"/>
          <circle cx="14" cy="14" r="4" fill="black"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" class="fill-black">
          <path d="M8 1l1.5 2.5h2.5l-2 2 0.5 2.5-2.5-1.5-2.5 1.5 0.5-2.5-2-2h2.5L8 1z"/>
        </svg>
      </div>
      <div class="text-xs text-center max-w-24 font-medium">Hyperparameter and training algorithm optimization</div>
    </div>

    <!-- Arrow 1 -->
    <div class="flex items-center mx-1">
      <svg width="40" height="20" viewBox="0 0 40 20">
        <line x1="5" y1="10" x2="30" y2="10" stroke="black" stroke-width="2"/>
        <polygon points="30,6 38,10 30,14" fill="black"/>
      </svg>
    </div>

    <!-- SCN Section -->
    <div class="flex flex-col items-center mx-2">
      <div 
        class="w-32 h-48 border-2 border-black rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white relative"
        on:mouseenter={(e) => showTooltip(e, descriptions.scn)}
        on:mouseleave={hideTooltip}
      >
        <!-- Top graph -->
        <div class="absolute top-3 left-3 w-24 h-14">
          <svg viewBox="0 0 96 56" class="w-full h-full">
            <circle cx="20" cy="12" r="3" fill="#2563eb"/>
            <circle cx="45" cy="8" r="3" fill="#eab308"/>
            <circle cx="70" cy="12" r="3" fill="#2563eb"/>
            <circle cx="15" cy="30" r="3" fill="#2563eb"/>
            <circle cx="45" cy="28" r="3" fill="#2563eb"/>
            <circle cx="75" cy="30" r="3" fill="#2563eb"/>
            <circle cx="20" cy="44" r="3" fill="#2563eb"/>
            <circle cx="70" cy="44" r="3" fill="#2563eb"/>
            <line x1="20" y1="12" x2="45" y2="8" stroke="#2563eb" stroke-width="1"/>
            <line x1="45" y1="8" x2="70" y2="12" stroke="#2563eb" stroke-width="1"/>
            <line x1="15" y1="30" x2="45" y2="28" stroke="#2563eb" stroke-width="1"/>
            <line x1="45" y1="28" x2="75" y2="30" stroke="#2563eb" stroke-width="1"/>
            <line x1="20" y1="44" x2="70" y2="44" stroke="#2563eb" stroke-width="1"/>
          </svg>
        </div>
        
        <!-- Middle graph -->
        <div class="absolute top-20 left-3 w-24 h-14">
          <svg viewBox="0 0 96 56" class="w-full h-full">
            <circle cx="25" cy="15" r="3" fill="#2563eb"/>
            <circle cx="50" cy="10" r="3" fill="#2563eb"/>
            <circle cx="75" cy="15" r="3" fill="#2563eb"/>
            <circle cx="25" cy="35" r="3" fill="#2563eb"/>
            <circle cx="75" cy="35" r="3" fill="#2563eb"/>
            <line x1="25" y1="15" x2="50" y2="10" stroke="#2563eb" stroke-width="1"/>
            <line x1="50" y1="10" x2="75" y2="15" stroke="#2563eb" stroke-width="1"/>
            <line x1="25" y1="35" x2="75" y2="35" stroke="#2563eb" stroke-width="1"/>
          </svg>
        </div>
        
        <!-- Bottom graph -->
        <div class="absolute bottom-3 left-3 w-24 h-14">
          <svg viewBox="0 0 96 56" class="w-full h-full">
            <circle cx="20" cy="15" r="3" fill="#eab308"/>
            <circle cx="50" cy="12" r="3" fill="#2563eb"/>
            <circle cx="80" cy="18" r="3" fill="#2563eb"/>
            <circle cx="35" cy="35" r="3" fill="#2563eb"/>
            <circle cx="65" cy="40" r="3" fill="#2563eb"/>
            <line x1="20" y1="15" x2="50" y2="12" stroke="#2563eb" stroke-width="1"/>
            <line x1="50" y1="12" x2="80" y2="18" stroke="#2563eb" stroke-width="1"/>
            <line x1="35" y1="35" x2="65" y2="40" stroke="#2563eb" stroke-width="1"/>
          </svg>
        </div>
      </div>
      <div class="text-xs text-center mt-2 font-medium max-w-32">
        <div>SCN/confGCN with CC</div>
        <div>Activation Layer 1(F)</div>
      </div>
    </div>

    <!-- Arrow 2 -->
    <div class="flex items-center mx-1">
      <svg width="40" height="80" viewBox="0 0 40 80">
        <line x1="20" y1="5" x2="20" y2="25" stroke="black" stroke-width="2"/>
        <line x1="20" y1="55" x2="20" y2="75" stroke="black" stroke-width="2"/>
        <polygon points="16,25 20,35 24,25" fill="black"/>
        <polygon points="16,55 20,45 24,55" fill="black"/>
      </svg>
    </div>

    <!-- Dense 1 -->
    <div class="flex flex-col items-center mx-2">
      <div 
        class="w-20 h-40 border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors bg-white flex flex-col justify-center items-center space-y-6"
        on:mouseenter={(e) => showTooltip(e, descriptions.dense1)}
        on:mouseleave={hideTooltip}
      >
        <div class="w-10 h-10 bg-blue-300 rounded-full"></div>
        <div class="w-10 h-10 bg-blue-300 rounded-full"></div>
        <div class="w-8 h-8 bg-blue-400 rounded-full"></div>
      </div>
      <div class="text-center font-medium mt-2">Dense 1</div>
    </div>

    <!-- Arrow 3 -->
    <div class="flex items-center mx-1">
      <svg width="40" height="20" viewBox="0 0 40 20">
        <line x1="5" y1="10" x2="30" y2="10" stroke="black" stroke-width="2"/>
        <polygon points="30,6 38,10 30,14" fill="black"/>
      </svg>
    </div>

    <!-- Activation Layer 2 -->
    <div class="flex flex-col items-center mx-2">
      <div 
        class="w-20 h-40 border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors bg-white flex flex-col justify-center items-center space-y-6"
        on:mouseenter={(e) => showTooltip(e, descriptions.activation2)}
        on:mouseleave={hideTooltip}
      >
        <div class="w-10 h-10 bg-pink-500 rounded-full"></div>
        <div class="w-10 h-10 bg-pink-500 rounded-full"></div>
        <div class="w-8 h-8 bg-pink-600 rounded-full"></div>
      </div>
      <div class="text-xs text-center mt-2 font-medium">
        <div>Activation Layer 2</div>
        <div>(c1*f1 + c2*f2)</div>
      </div>
    </div>

    <!-- Arrow 4 -->
    <div class="flex items-center mx-1">
      <svg width="40" height="80" viewBox="0 0 40 80">
        <line x1="20" y1="5" x2="20" y2="25" stroke="black" stroke-width="2"/>
        <line x1="20" y1="55" x2="20" y2="75" stroke="black" stroke-width="2"/>
        <polygon points="16,25 20,35 24,25" fill="black"/>
        <polygon points="16,55 20,45 24,55" fill="black"/>
      </svg>
    </div>

    <!-- Dense 2 -->
    <div class="flex flex-col items-center mx-2">
      <div 
        class="w-20 h-40 border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors bg-white flex flex-col justify-center items-center space-y-8"
        on:mouseenter={(e) => showTooltip(e, descriptions.dense2)}
        on:mouseleave={hideTooltip}
      >
        <div class="w-8 h-8 bg-green-500 rounded-full"></div>
        <div class="w-8 h-8 bg-green-500 rounded-full"></div>
        <div class="w-6 h-6 bg-green-600 rounded-full"></div>
      </div>
      <div class="text-center font-medium mt-2">Dense 2</div>
    </div>

    <!-- Arrow 5 -->
    <div class="flex items-center mx-1">
      <svg width="40" height="20" viewBox="0 0 40 20">
        <line x1="5" y1="10" x2="30" y2="10" stroke="black" stroke-width="2"/>
        <polygon points="30,6 38,10 30,14" fill="black"/>
      </svg>
    </div>

    <!-- Activation Layer 3 -->
    <div class="flex flex-col items-center mx-2">
      <div 
        class="w-20 h-40 border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors bg-white flex flex-col justify-center items-center space-y-10"
        on:mouseenter={(e) => showTooltip(e, descriptions.activation3)}
        on:mouseleave={hideTooltip}
      >
        <div class="w-8 h-8 bg-teal-500 rounded-full"></div>
        <div class="w-8 h-8 bg-teal-500 rounded-full"></div>
      </div>
      <div class="text-xs text-center mt-2 font-medium">
        <div>Activation Layer 3</div>
        <div>(c1*f1 + c2*f2)</div>
      </div>
    </div>

    <!-- Arrow 6 -->
    <div class="flex items-center mx-1">
      <svg width="40" height="20" viewBox="0 0 40 20">
        <line x1="5" y1="10" x2="30" y2="10" stroke="black" stroke-width="2"/>
        <polygon points="30,6 38,10 30,14" fill="black"/>
      </svg>
    </div>

    <!-- Output -->
    <div class="flex flex-col items-center mx-2">
      <div 
        class="w-20 h-40 border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors bg-white flex flex-col justify-center items-center space-y-3"
        on:mouseenter={(e) => showTooltip(e, descriptions.output)}
        on:mouseleave={hideTooltip}
      >
        <div class="w-10 h-10 bg-cyan-500 rounded-full"></div>
        <div class="w-10 h-10 bg-cyan-500 rounded-full"></div>
        <div class="w-10 h-10 bg-cyan-500 rounded-full"></div>
        <div class="w-8 h-8 bg-cyan-600 rounded-full"></div>
      </div>
      <div class="text-center font-medium mt-2">Output</div>
    </div>
  </div>

  <!-- Connection lines - Fixed positions with relative values -->
  <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: -1;">
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#666" />
      </marker>
    </defs>
    
    <!-- Using percentage-based positioning for more flexible layout -->
    <!-- Dense 1 to Activation 2 connections -->
    <g opacity="0.4" class="connections">
      <line x1="39%" y1="35%" x2="45%" y2="30%" stroke="#666" stroke-width="1.5"/>
      <line x1="39%" y1="40%" x2="45%" y2="40%" stroke="#666" stroke-width="1.5"/>
      <line x1="39%" y1="45%" x2="45%" y2="50%" stroke="#666" stroke-width="1.5"/>
      <line x1="39%" y1="37.5%" x2="45%" y2="35%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="39%" y1="42.5%" x2="45%" y2="45%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
    </g>
    
    <!-- Activation 2 to Dense 2 connections -->
    <g opacity="0.4" class="connections">
      <line x1="53%" y1="30%" x2="59%" y2="35%" stroke="#666" stroke-width="1.5"/>
      <line x1="53%" y1="40%" x2="59%" y2="40%" stroke="#666" stroke-width="1.5"/>
      <line x1="53%" y1="50%" x2="59%" y2="45%" stroke="#666" stroke-width="1.5"/>
      <line x1="53%" y1="35%" x2="59%" y2="37.5%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="53%" y1="45%" x2="59%" y2="42.5%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
    </g>
    
    <!-- Dense 2 to Activation 3 connections -->
    <g opacity="0.4" class="connections">
      <line x1="67%" y1="35%" x2="73%" y2="35%" stroke="#666" stroke-width="1.5"/>
      <line x1="67%" y1="40%" x2="73%" y2="45%" stroke="#666" stroke-width="1.5"/>
      <line x1="67%" y1="45%" x2="73%" y2="40%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
    </g>
    
    <!-- Activation 3 to Output connections -->
    <g opacity="0.4" class="connections">
      <line x1="81%" y1="35%" x2="87%" y2="30%" stroke="#666" stroke-width="1.5"/>
      <line x1="81%" y1="45%" x2="87%" y2="40%" stroke="#666" stroke-width="1.5"/>
      <line x1="81%" y1="40%" x2="87%" y2="50%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="81%" y1="40%" x2="87%" y2="60%" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
    </g>
  </svg>

  <!-- Tooltip with improved positioning and styling -->
  {#if tooltip.visible}
    <div
      class="fixed z-50 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
      style="left: {tooltip.x}px; top: {tooltip.y}px; transform: translateZ(0);"
    >
      {tooltip.content}
    </div>
  {/if}
</div>