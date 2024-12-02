class PDFProcessor {
    constructor() {
        this.pdfsContent = new Map();
        this.pdfList = [
            { name: 'Title 1: General Provisions', url: 'usc01@118-106.pdf' },
            { name: 'Title 2: The Congress', url: 'usc02@118-106.pdf' },
            { name: 'Title 3: The President', url: 'usc03@118-106.pdf' },
            { name: 'Title 4: Flag and Seal, Seat of Government, and the States', url: 'usc04@118-106.pdf' },
            { name: 'Title 5: Government Organization and Employees', url: 'usc05@118-106.pdf' },
            { name: 'Title 6: Domestic Security', url: 'usc06@118-106.pdf' },
            { name: 'Title 7: Agriculture', url: 'usc07@118-106.pdf' },
            { name: 'Title 8: Aliens and Nationality', url: 'usc08@118-106.pdf' },
            { name: 'Title 9: Arbitration', url: 'usc09@118-106.pdf' },
            { name: 'Title 10: Armed Forces', url: 'usc10@118-106.pdf' },
            { name: 'Title 11: Bankruptcy', url: 'usc11@118-106.pdf' },
            { name: 'Title 12: Banks and Banking', url: 'usc12@118-106.pdf' },
            { name: 'Title 13: Census', url: 'usc13@118-106.pdf' },
            { name: 'Title 14: Coast Guard', url: 'usc14@118-106.pdf' },
            { name: 'Title 15: Commerce and Trade', url: 'usc15@118-106.pdf' },
            { name: 'Title 16: Conservation', url: 'usc16@118-106.pdf' },
            { name: 'Title 17: Copyrights', url: 'usc17@118-106.pdf' },
            { name: 'Title 18: Crimes and Criminal Procedure', url: 'usc18@118-106.pdf' },
            { name: 'Title 19: Customs Duties', url: 'usc19@118-106.pdf' },
            { name: 'Title 20: Education', url: 'usc20@118-106.pdf' },
            { name: 'Title 21: Food and Drugs', url: 'usc21@118-106.pdf' },
            { name: 'Title 22: Foreign Relations and Intercourse', url: 'usc22@118-106.pdf' },
            { name: 'Title 23: Highways', url: 'usc23@118-106.pdf' },
            { name: 'Title 24: Hospitals and Asylums', url: 'usc24@118-106.pdf' },
            { name: 'Title 25: Indians', url: 'usc25@118-106.pdf' },
            { name: 'Title 26: Internal Revenue Code', url: 'usc26@118-106.pdf' },
            { name: 'Title 27: Intoxicating Liquors', url: 'usc27@118-106.pdf' },
            { name: 'Title 28: Judiciary and Judicial Procedure', url: 'usc28@118-106.pdf' },
            { name: 'Title 29: Labor', url: 'usc29@118-106.pdf' },
            { name: 'Title 30: Mineral Lands and Mining', url: 'usc30@118-106.pdf' },
            { name: 'Title 31: Money and Finance', url: 'usc31@118-106.pdf' },
            { name: 'Title 32: National Guard', url: 'usc32@118-106.pdf' },
            { name: 'Title 33: Navigation and Navigable Waters', url: 'usc33@118-106.pdf' },
            { name: 'Title 34: Crime Control and Law Enforcement', url: 'usc34@118-106.pdf' },
            { name: 'Title 35: Patents', url: 'usc35@118-106.pdf' },
            { name: 'Title 36: Patriotic and National Observances, Ceremonies, and Organizations', url: 'usc36@118-106.pdf' },
            { name: 'Title 37: Pay and Allowances of the Uniformed Services', url: 'usc37@118-106.pdf' },
            { name: 'Title 38: Veterans\' Benefits', url: 'usc38@118-106.pdf' },
            { name: 'Title 39: Postal Service', url: 'usc39@118-106.pdf' },
            { name: 'Title 40: Public Buildings, Property, and Works', url: 'usc40@118-106.pdf' },
            { name: 'Title 41: Public Contracts', url: 'usc41@118-106.pdf' },
            { name: 'Title 42: The Public Health and Welfare', url: 'usc42_ch1to6A_Secs1to300mm-64@118-106.pdf' },
            { name: 'Title 42 (cont. 1)', url: 'usc42_ch7to7A_Secs301to1400v@118-106.pdf' },
            { name: 'Title 42 (cont. 2)', url: 'usc42_ch8to39_Secs1401to3259@118-106.pdf' },
            { name: 'Title 42 (cont. 3)', url: 'usc42_ch40to81_Secs3271to6892@118-106.pdf' },
            { name: 'Title 42 (cont. 4)', url: 'usc42_ch82to123_Secs6901to11851@118-106.pdf' },
            { name: 'Title 42 (cont. 5)', url: 'usc42_ch124to164_Secs11901to19404@118-106.pdf' },
            { name: 'Title 43: Public Lands', url: 'usc43@118-106.pdf' },
            { name: 'Title 44: Public Printing and Documents', url: 'usc44@118-106.pdf' },
            { name: 'Title 45: Railroads', url: 'usc45@118-106.pdf' },
            { name: 'Title 46: Shipping', url: 'usc46@118-106.pdf' },
            { name: 'Title 47: Telecommunications', url: 'usc47@118-106.pdf' },
            { name: 'Title 48: Territories and Insular Posssessions', url: 'usc48@118-106.pdf' },
            { name: 'Title 49: Transportation', url: 'usc49@118-106.pdf' },
            { name: 'Title 50: War and National Defense', url: 'usc50@118-106.pdf' },
            { name: 'Title 51: National and Commercial Space Programs', url: 'usc51@118-106.pdf' },
            { name: 'Title 52: Voting and Elections', url: 'usc52@118-106.pdf' },
            { name: 'Title 53: [Reserved]', url: 'usc52@118-1065.pdf' },
            { name: 'Title 54: National Park Service and Related Programs', url: 'usc54@118-106.pdf' },
        ];
        this.statusContainer = document.getElementById('pdf-items');
        this.infoSection = document.querySelector('.info-content');
        this.completedDocs = 0;
        this.batchSize = 10; //process documents in batches of 10
        this.textChunkSize = 1000000;
        this.workerPool = [];
    }

    updateOverallProgress() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressBar && progressText) {
            const percentage = (this.completedDocs / this.pdfList.length) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${this.completedDocs}/${this.pdfList.length} complete`;
        }
    }

    async initializePDFs() {
        try {
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

            this.completedDocs = 0;

            this.statusContainer.innerHTML = '';

            for (let i = 0; i < this.maxWorkers; i++) {
                this.workerPool.push(new Worker('pdfWorker.js'));
            }

            let processingSection = document.querySelector('.processing-status-section');
            if (!processingSection) {
                processingSection = document.createElement('div');
                processingSection.className = 'info-section processing-status-section';
                this.infoSection.insertBefore(processingSection, this.infoSection.firstChild);
            }
            processingSection.innerHTML = `
                <h4>Processing Status</h4>
                <div class="processing-status-content">
                    <div class="status-indicator processing">
                        <i class="fas fa-sync fa-spin"></i>
                        <span>Processing documents...</span>
                    </div>
                    <div class="documents-progress">
                        <div class="progress-text">0/${this.pdfList.length} complete</div>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
            `;

            this.pdfList.forEach(pdf => {
                const statusElement = document.createElement('div');
                statusElement.className = 'pdf-status-item';
                statusElement.innerHTML = `
                    <div class="pdf-status-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="pdf-status-content">
                        <div class="pdf-status-name">${pdf.name}</div>
                        <div class="pdf-status-text" id="status-${pdf.name}">Waiting...</div>
                        <div class="pdf-status-progress" id="progress-${pdf.name}"></div>
                    </div>
                `;
                this.statusContainer.appendChild(statusElement);
            });

            for (let i = 0; i < this.pdfList.length; i += this.batchSize) {
                const batch = this.pdfList.slice(i, i + this.batchSize);
                await this.processBatch(batch);
                
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            processingSection.innerHTML = `
                <h4>Processing Status</h4>
                <div class="processing-status-content">
                    <div class="status-indicator success">
                        <i class="fas fa-check-circle"></i>
                        <span>Success!</span>
                    </div>
                    <div class="documents-progress">
                        <div class="progress-text">${this.pdfList.length}/${this.pdfList.length} complete</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            const finalStatus = document.createElement('div');
            finalStatus.className = 'pdf-status-success';
            finalStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                All documents loaded successfully
            `;
            this.statusContainer.appendChild(finalStatus);
            
            this.workerPool.forEach(worker => worker.terminate());
            this.workerPool = [];
            
            return true;
        } catch (error) {
            console.error('Error initializing PDFs:', error);
            const errorStatus = document.createElement('div');
            errorStatus.className = 'pdf-status-error';
            errorStatus.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                Error loading PDFs
            `;
            this.statusContainer.appendChild(errorStatus);
            return false;
        }
    }

    async processBatch(batch) {
        const batchPromises = batch.map(pdf => this.processPDF(pdf.url, pdf.name));
            await Promise.all(batchPromises);
    }

    async processPDF(url, name) {
        try {
            const statusElement = document.getElementById(`status-${name}`);
            const progressElement = document.getElementById(`progress-${name}`);
            
            statusElement.textContent = 'Loading document...';

            const pdf = await pdfjsLib.getDocument(url).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + ' ';
                
                const progress = Math.round((i/pdf.numPages) * 100);
                statusElement.textContent = `Processing page ${i} of ${pdf.numPages}`;
                progressElement.style.width = `${progress}%`;
            }

            this.pdfsContent[name] = this.preprocessText(fullText);

            statusElement.textContent = 'Processing complete';
            const statusItem = statusElement.closest('.pdf-status-item');
            statusItem.classList.add('complete');

            this.completedDocs++;
            this.updateOverallProgress();
            
        } catch (error) {
            console.error(`Error processing PDF ${name}:`, error);
            const statusElement = document.getElementById(`status-${name}`);
            statusElement.textContent = 'Error processing PDF';
            statusElement.closest('.pdf-status-item').classList.add('error');
            throw error;
        }
    }

    preprocessText(text) {
        return text
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    async searchRelevantContent(query) {
        const queryTerms = query.toLowerCase().split(' ');
        let relevantContent = '';
        
        for (const [docName, content] of Object.entries(this.pdfsContent)) {
            const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
            
            sentences.forEach(sentence => {
                const matchScore = queryTerms.reduce((score, term) => {
                    return score + (sentence.includes(term) ? 1 : 0);
                }, 0);

                if (matchScore > 0) {
                    relevantContent += sentence + ' ';
                }
            });
        }

        return relevantContent.slice(0, 2000);
    }
}
