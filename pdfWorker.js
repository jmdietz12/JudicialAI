self.onmessage = function(e) {
    const { chunk } = e.data;
    
    const processedText = chunk
        .replace(/\s+/g, ' ')
        .trim()
    
    self.postMessage(processedText);
};
