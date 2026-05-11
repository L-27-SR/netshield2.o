<script lang="ts">
    export let src: string = '';
    export let alt: string = '';
    export let caption: string = '';
    export let aspectRatio: string = 'aspect-square'; // default to square
</script>

<div class="image-card group">
    <div class="bg-slate-900/60 rounded-xl p-4 overflow-hidden transition-all duration-300 
                shadow-md hover:shadow-xl hover:shadow-cyan-400/10 group-hover:scale-[1.02]">
        {#if src}
            <img {src} {alt} class="w-full h-auto object-contain {aspectRatio}" />
            {#if caption}
                <p class="text-gray-400 text-sm mt-2 text-center">{caption}</p>
            {/if}
        {:else}
            <div class="flex items-center justify-center {aspectRatio} bg-slate-800/50 rounded-lg">
                <p class="text-gray-400">Image not available</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .image-card img {
        transition: transform 0.3s ease;
    }
    
    .image-card:hover img {
        transform: scale(1.05);
    }
</style>
