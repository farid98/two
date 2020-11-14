<script>
  import { HtmlTag } from "svelte/internal";
  import { selectedAnswer, selectedAnswerCorrect } from "./store.js";
  
  var showAnswer = true;
  var answered = false; // 0 means unanswered, 1 is incorrect answer, 2 is correct answer
  var questionNumber = 0;
  var totalQuestions = 0;
  let url = "../questions.json";

  async function fetchData() {
    const res = await fetch(url);
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  function toggleQuestion() {
    showAnswer = !showAnswer;
  }

  function nextQuestion(length) {
    if (questionNumber < length - 1) questionNumber++;
    else questionNumber = 0;

    answered = false;
    selectedAnswerCorrect.update((n) => false);
    selectedAnswer.update(() => 0);
  }

  function checkAnswer(correctAnswerNUmber, UseranswerNumber) {

    if ( answered ) return; // if question has been answered once, we cannot allow a change 

    selectedAnswer.update((n) => UseranswerNumber);
    answered = true;

    if (correctAnswerNUmber == UseranswerNumber) {
      selectedAnswerCorrect.update((n) => true);
    } else {
      selectedAnswerCorrect.update((n) => false);
    }
  }
</script>

<style>
  .icon {
    vertical-align: bottom;
  }
</style>

<main>
  

  {#await fetchData()}
    <p>loading</p>
  {:then allQuestions}
    <div class="container">
      <div class="columns">
        <div class="column is-5"> <!-- Questions and Answers -->
          <div class="box">
            <div class="tile is-ancestor">
              <div class="tile is-vertical is-parent">
                <div class="tile is-child box has-background-primary">
                  <p class="is-size-5">
                    {allQuestions[questionNumber].statement}
                  </p>
                </div>

                {#each Array(4) as _, i}
                  <div
                    on:click={() => checkAnswer(allQuestions[questionNumber].correct, i + 1)}
                    class="tile  is-child box  {$selectedAnswer == i + 1 ? 'has-background-dark-light' : 'has-background-primary-light'}   ">
                    <div class="columns is-mobile is-gapless is-vcentered">
                      <div class="column ">
                        <p class="is-size-5">
                          {allQuestions[questionNumber].answer[i]}
                        </p>
                      </div>
                      <div class="column is-narrow">
                        <div class="h1">
                          {#if $selectedAnswer == i + 1}
                            {#if $selectedAnswerCorrect == true}
                              <span class="icon is-size-3">
                                <i class="fas fa-check" />
                              </span>
                            {:else}
                              <span class="icon is-size-1">
                                <i class="fas fa-times" />
                              </span>
                            {/if}
                          {/if}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
        <div class="column is-4"> <!-- Results -->
          <div id="block_container" class="box">
            <div class="columns is-mobile is-vcenterd">
              <div class="column">
                <div class="title has-text-info  is-size-4 mt-2">
                  {!answered ? 'Select answer' : $selectedAnswerCorrect ? 'Correct' : 'Incorrect !'}
                </div>
              </div>
              <div class="column is-narrow align-content-right">
                {#if answered }
                  <div class="buttons">
                    <button
                      on:click={() => nextQuestion(allQuestions.length)}
                      class="button is-info ">Next Question
                    </button>
                  </div>
                {/if}
              </div>

             
            </div>
               <!-- Explanation if any-->

               {#if answered && !$selectedAnswerCorrect }

               <div> The correct answer is: {allQuestions[questionNumber].answer[allQuestions[questionNumber].correct - 1]}</div>

              {/if}

          </div>
        </div>
      </div>
    </div>
  {/await}
</main>
