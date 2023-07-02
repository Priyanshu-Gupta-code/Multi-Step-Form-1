const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const images=document.querySelectorAll(".plan-card-selection .img");
const switcher=document.querySelector(".switch");
const services = document.querySelectorAll(".box");
var template = document.querySelector("template");
var validName = false;
var validEmail = false;
var validPhoneNumber = false;
var currentStep=1;
const regexForName = /^[A-za-z ]+$/m;//Regular Expression pattern for name.
const regexForPhoneNum = /^\d{3}\d{3}\d{4}$/;//Regular Expression pattern for Phone Number.
const regexForEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;//Regular Expression for Email Address.
var acc={
    plan:"Arcade",
    kind:[],
    price:"$9/mo",
}
var isMonthly=true;
var img;
var sum=0;

steps.forEach(function(step){
    const nextBtn= step.querySelector(".next-stp");
    const prevBtn = step.querySelector(".prev-stp");
    nextBtn.addEventListener("click", function(){
        if(currentStep===1){
            const inputs=step.querySelectorAll("input");
            inputs.forEach(function(input){
                if(input.value===""){
                    step.querySelector("."+input.className+" p").classList.add("show-err");
                    input.style.border="1px solid red";
                } else {
                    step.querySelector("."+input.className+" p").classList.remove("show-err");
                    input.style.border="1px solid hsl(231, 11%, 63%)";
                }
            });
            if(inputs[0].value){
                if (regexForName.test(inputs[0].value)) {
                    step.querySelector(".name-error").style.display = "none";
                    inputs[0].style.border = "1px solid hsl(231, 11%, 63%)";
                    if (inputs[0].value.includes(' ')) {
                        step.querySelector(".space-error").style.display = "none";
                        inputs[0].style.border = "1px solid hsl(231, 11%, 63%)";
                        validName = true;
                    } else {
                        step.querySelector(".space-error").style.display = "flex";
                        inputs[0].style.border = "1px solid red";
                        validName = false;
                    }
                } else {
                    step.querySelector(".name-error").style.display = "flex";
                    inputs[0].style.border = "1px solid red";
                }
            }
            if(inputs[1].value){
                if (regexForEmail.test(inputs[1].value)) {
                    step.querySelector(".email-error").style.display = "none";
                    inputs[1].style.border = "1px solid hsl(231, 11%, 63%)";
                    validEmail = true;
                } else {
                    step.querySelector(".email-error").style.display = "flex";
                    inputs[1].style.border = "1px solid red";
                    validEmail = false;
                }
            }
            if(inputs[2].value){
                if (regexForPhoneNum.test(inputs[2].value)) {
                    step.querySelector(".phone-number-error").style.display = "none";
                    inputs[2].style.border = "1px solid hsl(231, 11%, 63%)";
                    validPhoneNumber = true;
                } else {
                    step.querySelector(".phone-number-error").style.display = "flex";
                    inputs[2].style.border = "1px solid red";
                    validPhoneNumber = false;
                } 
            }
            if(validName && validEmail && validPhoneNumber){
                activeNextStep(step);
                activeNextCircle();
            }
        } else if (currentStep === 4) {
            step.style.display = "none";
            document.querySelector(".step-5").style.display = "flex";
        } else if (currentStep === 3) {
            activeNextStep(step);
            calculatingTotal();
            activeNextCircle();
        } else {
            activeNextStep(step);
            activeNextCircle();
        }
    });
    if(prevBtn){
        prevBtn.addEventListener("click", function(){
            if (currentStep === 4) {
                removingTemplateContent();
            }
            step.style.display="none";
            document.querySelector(`.step-${--currentStep}`).style.display = "flex";
            document.querySelectorAll(".circle")[currentStep].classList.remove("active-circle");
            document.querySelectorAll(".circle")[--currentStep].classList.add("active-circle");
            ++currentStep;
        });
    }
});

function activeNextStep(step) {
    step.style.display = "none";
    steps[currentStep].style.display = "flex";
}

function activeNextCircle() {
    document.querySelectorAll(".circle")[--currentStep].classList.remove("active-circle");
    document.querySelectorAll(".circle")[++currentStep].classList.add("active-circle");
    ++currentStep;
}

images.forEach(function(image){
    image.addEventListener("click", function(ev){
        console.log(ev);
        document.querySelector(".effect").classList.remove("effect");
        image.classList.add("effect");
        img=image;
        const planName = image.querySelector(".plan-info p").innerHTML;
        const planPrice =image.querySelectorAll(".plan-info p")[1].innerHTML;
        acc.plan=planName;
        if(planName==="Arcade" && !isMonthly){
            acc.price=planPrice.substring(0,6);
        } else if((planName==='Advanced' && !isMonthly) || (planName==="Pro" && !isMonthly)){
            acc.price=planPrice.substring(0,7);
        } else {
            acc.price=planPrice;
        }
    });
});

switcher.addEventListener("click", function(){
    var isChecked =switcher.querySelector("input").checked;
    if(isChecked){
        document.querySelector(".monthly").classList.remove("sw-active");
        document.querySelector(".yearly").classList.add("sw-active");
        isMonthly=false;
        if(!img){
            acc.price="$90/yr"
        } 
    }else {
        document.querySelector(".yearly").classList.remove("sw-active");
        document.querySelector(".monthly").classList.add("sw-active");
        isMonthly=true;
        if(!img){
            acc.price="$9/mo";
        }
        changingInputChecked();
    }
    switchPrice(isChecked);
    switchStep3Price(isChecked);
});

function switchPrice(checked){
    const yearlyPrice = [90, 120, 150];
    const monthlyPrice = [9, 12, 15];
    const prices = document.querySelectorAll(".price");
    if(checked){
        prices[0].innerHTML = `$${yearlyPrice[0]}/yr<p class="free-month">2 months free</p>`;
        prices[1].innerHTML = `$${yearlyPrice[1]}/yr<p class="free-month">2 months free</p>`;
        prices[2].innerHTML = `$${yearlyPrice[2]}/yr<p class="free-month">2 months free</p>`;
        if (img) {
            acc.price = img.querySelector(".price").innerHTML.substring(0, 7);
        }
    } else {
        prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
        prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
        prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
        if (img) {
            acc.price = img.querySelector(".price").innerHTML.substring(0, 6);
        }
    }
}

function switchStep3Price(checked) {
    if (checked) {
        document.querySelectorAll(".services .price")[0].innerHTML = "+$10/yr";
        document.querySelectorAll(".services .price")[1].innerHTML = "+$20/yr";
        document.querySelectorAll(".services .price")[2].innerHTML = "+$20/yr";
    } else {
        document.querySelectorAll(".services .price")[0].innerHTML = "+$1/mo";
        document.querySelectorAll(".services .price")[1].innerHTML = "+$2/mo";
        document.querySelectorAll(".services .price")[2].innerHTML = "+$2/mo";
    }
}

services.forEach((service, n) => {
    service.addEventListener("click", function () {
        var serviceIsChecked = service.querySelector("input").checked;
        if (serviceIsChecked) {
            service.classList.add("effect");
            var servicePlan = service.querySelector("label").innerHTML;
            var servicePrice = service.querySelector(".price").innerHTML;
            var existingElement = acc.kind.find(function (item) {
                return item.serviceType === servicePlan && item.serviceCost === servicePrice;
            });
            if (!existingElement) {
                acc.kind.push({ serviceType: servicePlan, serviceCost: servicePrice });
            }
        } else {
            if (!serviceIsChecked) {
                service.classList.remove("effect");
                var foundElement = acc.kind.find(function (item) {
                    return item.serviceType === service.querySelector("label").innerHTML;
                });
                if (foundElement) {
                    var index = acc.kind.indexOf(foundElement);
                    acc.kind.splice(index, 1);
                }
            }
        }
    });
});
function calculatingTotal() {
    document.querySelector(".showing-selected-plancard .level").innerHTML = `${acc.plan}${isMonthly ? ` (Monthly)` : `(Yearly)`}`;
    document.querySelector(".showing-selected-plancard .level-price").innerHTML = `${acc.price}`;
    var gamingSelectedLevelPrice = parseInt(acc.price.substring(1,));
    Object.keys(acc.kind).forEach(function (e) {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".service-selected").innerHTML = acc.kind[e].serviceType;
        clone.querySelector(".service-price").innerHTML = acc.kind[e].serviceCost;
        sum += parseInt(acc.kind[e].serviceCost.substring(2,));
        const showingServices = document.querySelector(".showing-services");
        showingServices.appendChild(clone);
    });
    const totalAmount = sum + gamingSelectedLevelPrice;
    document.querySelector(".total p").innerHTML = `${isMonthly ? `+` : ``}$${totalAmount}${isMonthly ? `/mo` : `/yr`}`;
    document.querySelector(".total small").innerHTML = `Total${isMonthly ? ` (per month)` : ` (per year)`}`;
}

function removingTemplateContent() {
    sum = 0;
    document.querySelectorAll(".showing-selected-ad-ons").forEach(function (addons) {
        addons.remove();
    });
}

document.querySelector(".step-4 a").addEventListener("click", function () {
    steps[--currentStep].style.display = "none";
    steps[1].style.display = "flex";
    document.querySelectorAll(".circle")[1].classList.add("active-circle");
    document.querySelectorAll(".circle")[3].classList.remove("active-circle");
    currentStep = 2;
    removingTemplateContent();
});

function changingInputChecked() {
    services.forEach(function (service) {
        var makingInputCheckedFalse = service.querySelector("input").checked = false;
        service.classList.remove("effect");
    });
    acc.kind = [];
    sum = 0;
}