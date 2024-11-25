<script>
import axios from "axios";

export default {
	data() {
		return {
			currentField: 0,
			form: {
				name: "",
				surname: "",
				date_of_birth: "",
				email: "",
				password: "",
				password_confirmation: "",
				image: "",
				bio: "",
				status: "",
				is_private: false,
				friend_request_enabled: false,
			},
			errors: {
				name: false,
				surname: false,
				date_of_birth: false,
				email: false,
				password: false,
				password_confirmation: false,
			},
			fieldAttempted: {
				name: false,
				surname: false,
				date_of_birth: false,
				email: false,
				password: false,
				password_confirmation: false,
			},
			registrationError: null,
			successMessage: "", // Aggiunta per il messaggio di successo
			showSuccessMessage: false, // Flag per il messaggio di successo
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.focusInput();
		});
		this.createMovingBlobs();
	},
	watch: {
		currentField: {
			handler() {
				this.$nextTick(() => {
					this.focusInput();
				});
			},
			immediate: true,
		},
	},
	methods: {
		handleSubmit() {
			const currentFieldName = this.getFieldName(this.currentField);
			this.fieldAttempted[currentFieldName] = true;

			if (this.validateCurrentField()) {
				if (this.currentField < 10) {
					this.currentField++;
					// Reset attempted status for the next field
					const nextFieldName = this.getFieldName(this.currentField);
					if (this.fieldAttempted[nextFieldName] !== undefined) {
						this.fieldAttempted[nextFieldName] = false;
					}
				} else {
					this.registerUser();
				}
			}
		},

		validateCurrentField() {
			const currentFieldName = this.getFieldName(this.currentField);

			// Only validate if it's a field we track for errors
			if (
				!Object.prototype.hasOwnProperty.call(this.errors, currentFieldName)
			) {
				return true;
			}

			let isValid = true;

			// Check if field is required and empty
			if (this.isRequired(currentFieldName) && !this.form[currentFieldName]) {
				isValid = false;
			}

			// Special validation for email
			if (currentFieldName === "email" && this.form.email) {
				if (!this.isValidEmail(this.form.email)) {
					isValid = false;
				}
			}

			// Only show error if the field has been attempted
			this.errors[currentFieldName] =
				!isValid && this.fieldAttempted[currentFieldName];

			return isValid;
		},

		isValidEmail(email) {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailPattern.test(email);
		},

		prevField() {
			if (this.currentField > 0) {
				this.currentField--;
				// Reset error and attempted status for the field we're moving back to
				const previousFieldName = this.getFieldName(this.currentField);
				if (
					Object.prototype.hasOwnProperty.call(this.errors, previousFieldName)
				) {
					this.errors[previousFieldName] = false;
					this.fieldAttempted[previousFieldName] = false;
				}
			}
		},

		nextField() {
			const currentFieldName = this.getFieldName(this.currentField);
			this.fieldAttempted[currentFieldName] = true;

			if (this.validateCurrentField()) {
				if (this.currentField < 10) {
					this.currentField++;
					// Reset attempted status for the next field
					const nextFieldName = this.getFieldName(this.currentField);
					if (this.fieldAttempted[nextFieldName] !== undefined) {
						this.fieldAttempted[nextFieldName] = false;
					}
				}
			}
		},

		getFieldName(fieldIndex) {
			const fields = [
				"name",
				"surname",
				"date_of_birth",
				"email",
				"password",
				"password_confirmation",
				"image",
				"bio",
				"status",
				"is_private",
				"friend_request_enabled",
			];
			return fields[fieldIndex];
		},

		isRequired(field) {
			const requiredFields = [
				"name",
				"surname",
				"date_of_birth",
				"email",
				"password",
				"password_confirmation",
			];
			return requiredFields.includes(field);
		},

		focusInput() {
			const inputRefs = [
				"nameInput",
				"surnameInput",
				"dobInput",
				"emailInput",
				"passwordInput",
				"confirmPasswordInput",
				"imageInput",
				"bioInput",
				"statusInput",
				"privateInput",
				"friendRequestInput",
			];

			this.$nextTick(() => {
				const currentRef = inputRefs[this.currentField];
				if (this.$refs[currentRef]) {
					const element = this.$refs[currentRef];
					element.focus();

					if (
						element.type === "text" ||
						element.type === "password" ||
						element.type === "email"
					) {
						element.select();
					}
				}
			});
		},

		async registerUser() {
			try {
				const response = await axios.post(
					"http://localhost:8000/api/auth/register",
					this.form
				);
				console.log("Registration successful:", response.data);

				// Imposta il messaggio di successo
				this.successMessage = "Registration successful!";
				this.showSuccessMessage = true;

				// Reset del modulo (opzionale)
				this.resetForm();

				// Puoi eventualmente nascondere il messaggio dopo un po'
				setTimeout(() => {
					this.showSuccessMessage = false;
				}, 5000); // Nasconde il messaggio dopo 5 secondi
			} catch (error) {
				console.error("Registration error:", error.response.data);
				this.registrationError =
					error.response.data.message ||
					"Registration failed. Please try again.";
			}
		},

		resetForm() {
			this.form = {
				name: "",
				surname: "",
				date_of_birth: "",
				email: "",
				password: "",
				password_confirmation: "",
				image: "",
				bio: "",
				status: "",
				is_private: false,
				friend_request_enabled: false,
			};
			this.errors = {};
			this.currentField = 0;
		},

		beforeEnter(el) {
			el.style.opacity = 0;
		},
		enter(el, done) {
			setTimeout(() => {
				el.style.opacity = 1;
				done();
			}, 100);
		},
		leave(el, done) {
			el.style.opacity = 0;
			setTimeout(done, 300);
		},

		createMovingBlobs() {
			const container = document.querySelector(".background");
			const numberOfBlobs = 5;

			for (let i = 0; i < numberOfBlobs; i++) {
				const blob = document.createElement("div");
				blob.classList.add("blob");
				container.appendChild(blob);
				this.animateBlob(blob);
			}
		},

		animateBlob(blob) {
			const size = Math.random() * (200 - 100) + 100; // Dimensioni più variegate
			const startX = Math.random() * 100 + "%";
			const startY = Math.random() * 100 + "%";
			const animationDuration = Math.random() * (25 - 15) + 15 + "s"; // Animazioni più lente

			blob.style.width = size + "px";
			blob.style.height = size + "px";
			blob.style.position = "absolute";
			blob.style.top = startY;
			blob.style.left = startX;
			blob.style.borderRadius = "50%";

			// Colori variegati con diverse opacità
			const r = Math.floor(Math.random() * 256);
			const g = Math.floor(Math.random() * 256);
			const b = Math.floor(Math.random() * 256);
			const alpha = Math.random() * 0.5 + 0.2; // Opacità tra 0.2 e 0.7
			blob.style.background = `rgba(${r}, ${g}, ${b}, ${alpha})`;

			blob.style.animation = `moveBlob ${animationDuration} infinite ease-in-out`;
		},
	},
};
</script>

<template>
	<div class="background">
		<div class="registration-card">
			<h2>Register</h2>

			<!-- Messaggio di successo -->
			<div v-if="showSuccessMessage" class="success-message">
				<p>{{ successMessage }}</p>
			</div>

			<transition
				name="fade"
				@before-enter="beforeEnter"
				@enter="enter"
				@leave="leave">
				<form @submit.prevent="handleSubmit" key="form">
					<!-- Campo Nome -->
					<div v-if="currentField === 0">
						<label for="name">Name</label>
						<input
							type="text"
							v-model="form.name"
							required
							maxlength="50"
							ref="nameInput"
							@keyup.enter="nextField"
							:class="{ error: errors.name }" />
						<div v-if="errors.name" class="error-message">Name is required</div>
					</div>

					<!-- Campo Cognome -->
					<div v-if="currentField === 1">
						<label for="surname">Surname</label>
						<input
							type="text"
							v-model="form.surname"
							required
							maxlength="50"
							ref="surnameInput"
							@keyup.enter="nextField"
							:class="{ error: errors.surname }" />
						<div v-if="errors.surname" class="error-message">
							Surname is required
						</div>
					</div>

					<!-- Campo Data di Nascita -->
					<div v-if="currentField === 2">
						<label for="date_of_birth">Date of Birth</label>
						<input
							type="date"
							v-model="form.date_of_birth"
							required
							ref="dobInput"
							@keyup.enter="nextField"
							:class="{ error: errors.date_of_birth }" />
						<div v-if="errors.date_of_birth" class="error-message">
							Date of birth is required
						</div>
					</div>

					<!-- Campo Email -->
					<div v-if="currentField === 3">
						<label for="email">Email</label>
						<input
							type="email"
							v-model="form.email"
							required
							maxlength="255"
							ref="emailInput"
							@keyup.enter="nextField"
							:class="{ error: errors.email }" />
						<div v-if="errors.email" class="error-message">
							Email non valida
						</div>
					</div>

					<!-- Campo Password -->
					<div v-if="currentField === 4">
						<label for="password">Password</label>
						<input
							type="password"
							v-model="form.password"
							required
							ref="passwordInput"
							@keyup.enter="nextField"
							:class="{ error: errors.password }" />
						<div v-if="errors.password" class="error-message">
							Password is required
						</div>
					</div>

					<!-- Campo Conferma Password -->
					<div v-if="currentField === 5">
						<label for="password_confirmation">Confirm Password</label>
						<input
							type="password"
							v-model="form.password_confirmation"
							required
							ref="confirmPasswordInput"
							@keyup.enter="nextField"
							:class="{ error: errors.password_confirmation }" />
						<div v-if="errors.password_confirmation" class="error-message">
							Please confirm your password
						</div>
					</div>

					<!-- Campo Immagine -->
					<div v-if="currentField === 6">
						<label for="image">Image URL</label>
						<input
							type="text"
							v-model="form.image"
							maxlength="255"
							ref="imageInput"
							@keyup.enter="nextField" />
					</div>

					<!-- Campo Biografia -->
					<div v-if="currentField === 7">
						<label for="bio">Bio</label>
						<textarea
							v-model="form.bio"
							ref="bioInput"
							@keyup.enter="nextField"></textarea>
					</div>

					<!-- Campo Status -->
					<div v-if="currentField === 8">
						<label for="status">Status</label>
						<input
							type="text"
							v-model="form.status"
							ref="statusInput"
							@keyup.enter="nextField" />
					</div>

					<!-- Campo Account Privato -->
					<div v-if="currentField === 9">
						<label for="is_private">Private Account</label>
						<input
							type="checkbox"
							v-model="form.is_private"
							ref="privateInput" />
					</div>

					<!-- Campo Abilitazione Richiesta Amici -->
					<div v-if="currentField === 10">
						<label for="friend_request_enabled">Friend Request Enabled</label>
						<input
							type="checkbox"
							v-model="form.friend_request_enabled"
							ref="friendRequestInput" />
					</div>

					<!-- Pannello di Navigazione -->
					<div class="navigation-buttons">
						<button
							type="button"
							class="back-button"
							@click="prevField"
							v-if="currentField > 0">
							<i class="fas fa-arrow-left"></i>
						</button>
						<button
							type="button"
							@click="nextField"
							:disabled="isNextButtonDisabled"
							v-if="currentField < 10">
							<i class="fas fa-arrow-right"></i>
						</button>
						<button type="submit" v-if="currentField === 10">
							<i class="fas fa-check"></i>
						</button>
					</div>
				</form>
			</transition>
		</div>
	</div>
</template>

<style scoped>
@keyframes gradientAnimation {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

/* Background with animated blobs */
.background {
	background: linear-gradient(
		135deg,
		#1e3c72,
		#2a5298
	); /* Gradient più scuro per contrasto */
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
}

/* Styling for blobs */
.blob {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	will-change: transform;
	opacity: 0.7; /* Trasparenza */
	z-index: -1; /* Dietro la card */
	animation: moveBlob 20s infinite ease-in-out !important; /* Assicura che l'animazione sia applicata */
}

/* Registration card styling */
.registration-card {
	position: relative;
	z-index: 10;
	background: rgba(255, 255, 255, 0.3);
	backdrop-filter: blur(15px); /* Maggiore effetto blur */
	border-radius: 15px;
	padding: 25px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); /* Ombra più decisa */
	color: #fff;
	max-width: 420px;
	width: 100%;
	transition: transform 0.3s ease-in-out; /* Transizione per la registrazione */
}

/* Animation for the movement of blobs */
@keyframes moveBlob {
	0% {
		transform: translate(0, 0) scale(1);
	}
	25% {
		transform: translate(-20vw, 15vh) scale(1.2);
	}
	50% {
		transform: translate(30vw, -10vh) scale(0.8);
	}
	75% {
		transform: translate(-10vw, -20vh) scale(1.1);
	}
	100% {
		transform: translate(0, 0) scale(1);
	}
}

/* Heading */
.registration-card h2 {
	text-align: center;
	font-size: 1.8rem;
	font-weight: 600;
	margin-bottom: 20px;
	color: #fff;
}

/* Field Containers */
.registration-card div {
	margin-bottom: 1.5em;
}

/* Labels for Inputs */
.registration-card label {
	display: block;
	margin-bottom: 0.5em;
	color: #fff;
	font-size: 1rem;
}

/* Inputs and Textarea */
.registration-card input,
.registration-card textarea {
	width: 100%;
	padding: 12px;
	border: none;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.3);
	color: #fff;
	transition: background 0.3s ease;
}

.registration-card input:focus,
.registration-card textarea:focus {
	background: rgba(255, 255, 255, 0.5); /* Effetto al focus */
	outline: none;
}

/* Navigation buttons styling */
.registration-card .navigation-buttons {
	display: flex;
	justify-content: flex-end; /* Allinea i bottoni a destra */
	gap: 10px; /* Spazio tra i bottoni */
}

.registration-card .navigation-buttons button {
	width: 40px;
	height: 40px;
	background: linear-gradient(135deg, #6a11cb, #2575fc);
	background-size: 200% 200%;
	color: white;
	border: none;
	border-radius: 50%;
	font-size: 1.2rem;
	cursor: pointer;
	transition: background 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
}

.registration-card .navigation-buttons button:hover {
	animation: gradientAnimation 1.5s ease infinite;
	transform: translateY(-2px);
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Back Button Styling */
.registration-card .navigation-buttons button.back-button {
	background: linear-gradient(135deg, #ff6a00, #ee0979);
}

.registration-card .navigation-buttons button.back-button:hover {
	animation: gradientAnimation 1.5s ease infinite;
	transform: translateY(-2px);
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Error styling */
.error {
	border: 2px solid red;
}

/* Error message styling */
.error-message {
	color: red;
	font-size: 0.9rem;
	margin-top: 0.25rem;
}

/* Success message styling */
.success-message {
	background-color: #4caf50;
	color: white;
	padding: 10px;
	border-radius: 5px;
	text-align: center;
	font-size: 1rem;
	margin-bottom: 20px;
	transition: opacity 0.5s ease-out;
}

.success-message p {
	margin: 0;
}

/* Styling for the form when it's submitting or when errors occur */
.registration-card .submitting {
	opacity: 0.7; /* Visual feedback that something is happening */
	pointer-events: none; /* Prevent interaction */
}
</style>
