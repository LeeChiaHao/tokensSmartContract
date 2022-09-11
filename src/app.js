App = {
  loading: false,
  account: null,
  contract20: {},
  contract721: {},
  LCH20: null,
  LCH721: null,

  load: async () => {
    await App.loadAccount();
  },

  loadAccount: async () => {
    ethereum.on("accountsChanged", function () {
      window.location.reload()
    })
    try {
      await ethereum.request({ method: 'eth_requestAccounts' }).then(function () {
        console.log("Success");
        $(".title").text("Smart Contract Tokens")
      })
    } catch (e) {
      console.log("Error");
      $(".title").text("Smart Contract Tokens(Conncect to Metamask to continue)")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    App.account = accounts[0];
    if (accounts.length != 0) {
      console.log(accounts);
      await App.loadContract();
      await App.loadValue();
      await App.tokenShowHide();
      await App.mint721();
      await App.burn721();
      await App.load721Token();
      await App.mint20();
      await App.transfer20();
    }
  },

  // load and deployed contract from .json
  loadContract: async () => {
    const LCH20 = await $.getJSON('LeeChiaHao20.json');
    App.contract20 = TruffleContract(LCH20);
    App.contract20.setProvider(window.ethereum);
    App.LCH20 = await App.contract20.deployed();

    const LCH721 = await $.getJSON('LeeChiaHao721.json');
    App.contract721 = TruffleContract(LCH721);
    App.contract721.setProvider(window.ethereum);
    App.LCH721 = await App.contract721.deployed();
  },

  // load this address's value
  loadValue: async () => {
    $("#name721").val(await App.LCH721.name())
    $("#symbol721").val(await App.LCH721.symbol())
    $(".curAddress").val(App.account)
    $("#total721").val()

    $("#name20").val(await App.LCH20.name())
    $("#symbol20").val(await App.LCH20.symbol())
    $("#bal20").val((await App.LCH20.balanceOf(App.account) * 1e-18).toFixed(2))
    $("#total20").val(((await App.LCH20.totalSupply()) * 1e-18).toFixed(2))

    // check the pause function
    let owner = await App.LCH721.owner()
    if (owner.toLowerCase() == App.account.toLowerCase()) {
      console.log(await App.LCH721.paused());
      if (await App.LCH721.paused() == true) {
        $("#unPause").show()
        $("#pause").hide()
      } else {
        $("#pause").show()
        $("#unPause").hide()
      }
      $("#pause").on("click", async function () {
        await App.LCH721.pause({ from: App.account }).then(() => {
          $("#unPause").show()
          $("#pause").hide()
        })
      })

      $("#unPause").on("click", async function () {
        await App.LCH721.unPause({ from: App.account }).then(() => {
          $("#pause").show()
          $("#unPause").hide()
        })
      })
    } else {
      $(".pause").hide()
    }
  },

  // set mint token721 button function - show minted token ID and update the list
  mint721: async () => {
    $("#mint721").on("click", async function () {
      await App.LCH721.safeMint(App.account, { from: App.account }).then(async function () {
        var id = await App.LCH721.getCounter()
        $("#total721").val(id.toNumber())
        id = id.toNumber() - 1
        $("#mintId721").val(id)
        $("#tokenOwn").append(
          "<li class='list-group-item'>Token ID: " + id + "</li>"
        )
      })
    })
  },

  // set burn token721 button function, check id validity and reload after burned
  burn721: async () => {
    $(".burn721Error").hide()
    $("#burn721").on("click", async function () {
      var burnID = $("#burnId721").val()
      console.log(burnID);
      if (burnID == NaN) {
        $(".burn721Error").show()
      } else {
        try {
          await App.LCH721.ownerOf(burnID).then(async function () {
            $(".burn721Error").hide()
            await App.LCH721.burn(burnID, { from: App.account }).then(() => {
              window.location.reload()
            })
          })
        } catch (e) {
          $(".burn721Error").show()
        }
      }
    })
  },

  // load token721  with append <li>
  load721Token: async () => {
    var counter = await App.LCH721.getCounter()
    counter = counter.toNumber()
    $("#total721").val(counter)
    for (var x = 0; x < counter; x++) {
      try {
        await App.LCH721.ownerOf(x).then(async function (owner) {
          if (owner.toLowerCase() == App.account) {
            $("#tokenOwn").append(
              "<li class='list-group-item'>Token ID: " + x + "</li>"
            )
          }
        })
      } catch (e) {
        console.log("error");
      }
    }
  },

  // set 2 different menus no show at the same time
  tokenShowHide: async () => {
    $(".form721id").attr("id", "form721")
    $(".form20id").attr("id", "form20")
    $("#form721").addClass("show")

    $(".form721").on("click", function () {
      if ($("#form20").hasClass("show")) {
        $("#form20").removeClass("show")
      }

    })
    $(".form20").on("click", function () {
      if ($("#form721").hasClass("show")) {
        $("#form721").removeClass("show")
      }
    })
  },

  // set mint token20 button function - check cannot exceed max and update the balance&total after minted
  mint20: async () => {
    $(".maxMint").hide()
    $(".mint20Error").hide()
    $("#mint20").on("click", async function () {
      try {
        var amount = $("#mintNum20").val()
        if (amount == NaN) {
          console.log("No empty");
        } else {
          if ((parseInt($("#total20").val()) + parseInt(amount)) > 1000000) {
            $(".maxMint").show()
          } else {
            $(".maxMint").hide()
            $(".mint20Error").hide()

            await App.LCH20.mint(App.account, amount, { from: App.account }).then(async () => {
              $("#bal20").val((await App.LCH20.balanceOf(App.account) * 1e-18).toFixed(2))
              $("#total20").val(((await App.LCH20.totalSupply()) * 1e-18).toFixed(2))
              $("#mintNum20").val(NaN)
            })
          }
        }
      } catch (e) {
        $(".mint20Error").show()
      }
    })
  },

  // set transfer token20 button function - cannot be empty and update balance&total after transfered
  transfer20: async () => {
    $(".transferError").hide()
    $("#transfer").on("click", async function () {
      var address = $("#toAddress").val()
      var amount = $("#toAmount").val()
      if (address == "" || amount == "") {
        $(".transferError").show()
      } else {
        try {
          $(".transferError").hide()
          await App.LCH20.transfer(address, amount, { from: App.account }).then(async (val) => {
            $(".trans").text(amount * (9 / 10))
            $(".burn").text(amount / 10)
            $(".partialBurn").removeClass("d-none")
            $("#toAddress").val("")
            $("#toAmount").val("")
            $("#bal20").val((await App.LCH20.balanceOf(App.account) * 1e-18).toFixed(2))
            $("#total20").val(((await App.LCH20.totalSupply()) * 1e-18).toFixed(2))
          })
        } catch (e) {
          $(".transferError").show()
        }
      }
    })
  },
}

$(() => {
  $(window).load(() => {
    App.load();
  })
})
